<template>
  <div class="photos-container">
    <!-- 顶部导航 -->
    <van-nav-bar 
      title="家庭相册" 
      left-arrow 
      @click-left="$router.back()"
      fixed
      placeholder
    >
      <template #right>
        <van-icon name="plus" size="20" @click="navigateToUpload" />
      </template>
    </van-nav-bar>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索照片、相册或标签"
        @search="onSearch"
        @clear="onClear"
      />
      
      <div class="filter-tabs">
        <van-tabs v-model:active="activeTab" @change="onTabChange" sticky>
          <van-tab title="全部" name="all" />
          <van-tab title="相册" name="albums" />
          <van-tab title="最近" name="recent" />
          <van-tab title="收藏" name="favorites" />
        </van-tabs>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <!-- 相册视图 -->
      <div v-if="activeTab === 'albums'" class="albums-view">
        <div class="albums-grid">
          <div 
            v-for="album in albums" 
            :key="album.id"
            class="album-item"
            @click="openAlbum(album)"
          >
            <div class="album-cover">
              <img :src="album.cover" :alt="album.name" />
              <div class="album-count">{{ album.count }}</div>
            </div>
            <div class="album-info">
              <h4 class="album-name">{{ album.name }}</h4>
              <p class="album-date">{{ formatDate(album.updatedAt) }}</p>
            </div>
          </div>
          
          <!-- 创建相册按钮 -->
          <div class="album-item create-album" @click="createAlbum">
            <div class="album-cover">
              <van-icon name="plus" size="32" color="#999" />
            </div>
            <div class="album-info">
              <h4 class="album-name">创建相册</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- 照片网格视图 -->
      <div v-else class="photos-view">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多照片了"
            @load="onLoad"
          >
            <!-- 按日期分组 -->
            <div v-for="group in groupedPhotos" :key="group.date" class="date-group">
              <div class="date-header">
                <span class="date-text">{{ formatDateGroup(group.date) }}</span>
                <span class="photo-count">{{ group.photos.length }}张照片</span>
              </div>
              
              <div class="photos-grid">
                <div 
                  v-for="photo in group.photos" 
                  :key="photo.id"
                  class="photo-item"
                  @click="previewPhoto(photo, group.photos)"
                >
                  <img :src="photo.thumbnail" :alt="photo.title" />
                  <div v-if="photo.isVideo" class="video-indicator">
                    <van-icon name="play" color="white" size="16" />
                  </div>
                  <div v-if="photo.isFavorite" class="favorite-indicator">
                    <van-icon name="star" color="#FFD700" size="12" />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 空状态 -->
            <van-empty 
              v-if="groupedPhotos.length === 0 && !loading" 
              description="还没有照片"
              image="photo-fail"
            >
              <van-button type="primary" size="small" @click="navigateToUpload">
                上传第一张照片
              </van-button>
            </van-empty>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>

    <!-- 悬浮操作按钮 -->
    <van-floating-bubble
      axis="xy"
      icon="photograph"
      @click="navigateToUpload"
      :style="{ right: '20px', bottom: '100px' }"
    />

    <!-- 照片预览 -->
    <van-image-preview
      v-model:show="showPreview"
      :images="previewImages"
      :start-position="previewIndex"
      @change="onPreviewChange"
    >
      <template #cover>
        <div class="preview-cover">
          <div class="preview-header">
            <van-icon name="cross" size="20" color="white" @click="showPreview = false" />
            <div class="preview-actions">
              <van-icon 
                :name="currentPhoto?.isFavorite ? 'star' : 'star-o'" 
                size="20" 
                :color="currentPhoto?.isFavorite ? '#FFD700' : 'white'"
                @click="toggleFavorite"
              />
              <van-icon name="share" size="20" color="white" @click="sharePhoto" />
              <van-icon name="delete" size="20" color="white" @click="deletePhoto" />
            </div>
          </div>
          <div class="preview-info">
            <h4>{{ currentPhoto?.title }}</h4>
            <p>{{ formatDateTime(currentPhoto?.createdAt) }}</p>
            <p>上传者：{{ currentPhoto?.uploader }}</p>
          </div>
        </div>
      </template>
    </van-image-preview>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import dayjs from 'dayjs'

const router = useRouter()

// 响应式数据
const searchKeyword = ref('')
const activeTab = ref('all')
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const showPreview = ref(false)
const previewImages = ref<string[]>([])
const previewIndex = ref(0)
const currentPhoto = ref<any>(null)

// 相册数据
const albums = ref([
  {
    id: 1,
    name: '春游相册',
    cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    count: 25,
    updatedAt: '2024-03-15'
  },
  {
    id: 2,
    name: '生日聚会',
    cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    count: 18,
    updatedAt: '2024-03-10'
  },
  {
    id: 3,
    name: '日常生活',
    cover: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    count: 156,
    updatedAt: '2024-03-14'
  }
])

// 照片数据
const photos = ref([
  {
    id: 1,
    title: '春游合影',
    url: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    thumbnail: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    createdAt: '2024-03-15 14:30:00',
    uploader: '张三',
    albumId: 1,
    isVideo: false,
    isFavorite: true,
    tags: ['春游', '家庭', '户外']
  },
  {
    id: 2,
    title: '美食分享',
    url: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    thumbnail: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    createdAt: '2024-03-15 12:15:00',
    uploader: '李四',
    albumId: 3,
    isVideo: false,
    isFavorite: false,
    tags: ['美食', '午餐']
  },
  {
    id: 3,
    title: '生日视频',
    url: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    thumbnail: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    createdAt: '2024-03-10 19:20:00',
    uploader: '王五',
    albumId: 2,
    isVideo: true,
    isFavorite: true,
    tags: ['生日', '庆祝', '视频']
  }
])

// 计算属性：按日期分组的照片
const groupedPhotos = computed(() => {
  let filteredPhotos = photos.value

  // 根据标签页筛选
  if (activeTab.value === 'recent') {
    filteredPhotos = filteredPhotos.slice(0, 20) // 最近20张
  } else if (activeTab.value === 'favorites') {
    filteredPhotos = filteredPhotos.filter(photo => photo.isFavorite)
  }

  // 搜索筛选
  if (searchKeyword.value) {
    filteredPhotos = filteredPhotos.filter(photo => 
      photo.title.includes(searchKeyword.value) ||
      photo.tags.some(tag => tag.includes(searchKeyword.value))
    )
  }

  // 按日期分组
  const groups = filteredPhotos.reduce((acc, photo) => {
    const date = dayjs(photo.createdAt).format('YYYY-MM-DD')
    if (!acc[date]) {
      acc[date] = {
        date,
        photos: []
      }
    }
    acc[date].photos.push(photo)
    return acc
  }, {} as Record<string, any>)

  return Object.values(groups).sort((a: any, b: any) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
})

// 方法
const navigateToUpload = () => {
  router.push('/photos/upload')
}

const onTabChange = (name: string) => {
  activeTab.value = name
}

const onSearch = (value: string) => {
  searchKeyword.value = value
}

const onClear = () => {
  searchKeyword.value = ''
}

const onRefresh = () => {
  setTimeout(() => {
    refreshing.value = false
    showToast.success('刷新成功')
  }, 1000)
}

const onLoad = () => {
  setTimeout(() => {
    loading.value = false
    finished.value = true
  }, 1000)
}

const openAlbum = (album: any) => {
  showToast(`打开相册：${album.name}`)
}

const createAlbum = () => {
  showToast('创建相册功能开发中')
}

const previewPhoto = (photo: any, photos: any[]) => {
  currentPhoto.value = photo
  previewImages.value = photos.map(p => p.url)
  previewIndex.value = photos.findIndex(p => p.id === photo.id)
  showPreview.value = true
}

const onPreviewChange = (index: number) => {
  const allPhotos = groupedPhotos.value.flatMap(group => group.photos)
  currentPhoto.value = allPhotos[index]
}

const toggleFavorite = () => {
  if (currentPhoto.value) {
    currentPhoto.value.isFavorite = !currentPhoto.value.isFavorite
    showToast(currentPhoto.value.isFavorite ? '已收藏' : '已取消收藏')
  }
}

const sharePhoto = () => {
  showToast('分享功能开发中')
}

const deletePhoto = () => {
  showConfirmDialog({
    title: '删除照片',
    message: '确定要删除这张照片吗？',
  }).then(() => {
    showToast.success('删除成功')
    showPreview.value = false
  }).catch(() => {
    // 取消删除
  })
}

const formatDate = (date: string) => {
  return dayjs(date).format('MM月DD日')
}

const formatDateGroup = (date: string) => {
  const today = dayjs().format('YYYY-MM-DD')
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  
  if (date === today) return '今天'
  if (date === yesterday) return '昨天'
  return dayjs(date).format('MM月DD日')
}

const formatDateTime = (datetime: string) => {
  return dayjs(datetime).format('YYYY年MM月DD日 HH:mm')
}

onMounted(() => {
  // 初始化数据
})
</script>

<style lang="scss" scoped>
.photos-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 80px;
}

.search-section {
  background: white;
  padding: 16px 16px 0;
  
  .filter-tabs {
    margin-top: 16px;
    
    :deep(.van-tabs__nav) {
      background: white;
    }
  }
}

.content-section {
  padding: 16px;
}

.albums-view {
  .albums-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    
    .album-item {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: transform 0.2s;
      
      &:active {
        transform: scale(0.98);
      }
      
      &.create-album {
        .album-cover {
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      
      .album-cover {
        position: relative;
        width: 100%;
        height: 120px;
        overflow: hidden;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .album-count {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 12px;
        }
      }
      
      .album-info {
        padding: 12px;
        
        .album-name {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }
        
        .album-date {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}

.photos-view {
  .date-group {
    margin-bottom: 20px;
    
    .date-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .date-text {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }
      
      .photo-count {
        font-size: 12px;
        color: #999;
      }
    }
    
    .photos-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
      
      .photo-item {
        position: relative;
        aspect-ratio: 1;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.2s;
        }
        
        &:active img {
          transform: scale(1.05);
        }
        
        .video-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .favorite-indicator {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}

.preview-cover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.7) 0%,
    transparent 30%,
    transparent 70%,
    rgba(0, 0, 0, 0.7) 100%
  );
  pointer-events: none;
  
  .preview-header {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: auto;
    
    .preview-actions {
      display: flex;
      gap: 20px;
    }
  }
  
  .preview-info {
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    color: white;
    pointer-events: auto;
    
    h4 {
      font-size: 18px;
      margin-bottom: 8px;
    }
    
    p {
      font-size: 14px;
      opacity: 0.8;
      margin-bottom: 4px;
    }
  }
}

// 老人模式适配
:global(.elder-mode) .photos-container {
  .album-name {
    font-size: 16px !important;
  }
  
  .date-text {
    font-size: 18px !important;
  }
  
  .preview-info h4 {
    font-size: 20px !important;
  }
}
</style>