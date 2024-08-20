<template>
  <div>
    <h1>Dictionary</h1>
    <input type="text" v-model="searchQuery" placeholder="Search..." @input="onSearch" />
    <table id="words" class="ui celled compact table">
      <thead>
        <tr>
          <th>No.</th>
          <th>English</th>
          <th>German</th>
          <th>French</th>
          <th colspan="5"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(word, i) in paginatedWords" :key="i">
          <td>{{ (i + 1) }}</td>
          <td>{{ word.english }}</td>
          <td>{{ word.german }}</td>
          <td>{{ word.french }}</td>
          <td width="75" class="center aligned">
            <router-link :to="{ name:'show', params: { id: word._id }}">Show</router-link>
          </td>
          <td width="75" class="center aligned">
            <router-link :to="{ name:'edit', params: { id: word._id }}">Edit</router-link>
          </td>
          <td width="75" class="center aligned" @click.prevent="onDestroy(word._id)">
            <a :href="`/words/${word._id}`">Delete</a>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">
        <i class="left chevron icon"></i> Previous
      </button>
      <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">
        Next <i class="right chevron icon"></i>
      </button>
    </div>
    
  </div>
</template>

<style>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  background-color: #2185d0;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
}

.pagination-button i {
  margin-right: 5px;
}

.pagination-button:disabled {
  background-color: #b0b0b0;
  cursor: not-allowed;
}

.pagination-button:not(:disabled):hover {
  background-color: #1678c2;
}

.pagination-info {
  font-weight: bold;
  margin: 0 15px;
}
</style>

<script>
import { api } from '../helpers/helpers';

export default {
  name: 'words',
  data() {
    return {
      words: [],
      searchQuery: '',
      currentPage: 1,
      pageSize: 10, // Number of items per page
    };
  },
  computed: {
    filteredWords() {
      return this.words.filter(word => 
        word.english.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        word.german.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        word.french.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedWords() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredWords.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredWords.length / this.pageSize);
    }
  },
  methods: {

    async onDestroy(id) {
      const sure = window.confirm('Are you sure?');
      if (!sure) return;
      await api.deleteWord(id);
      this.flash('Word deleted successfully!', 'success');
      this.words = this.words.filter(word => word._id !== id);
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    },
    async onSearch() {
      this.currentPage = 1;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
  async mounted() {
    this.words = await api.getWords();
  }
};
</script>