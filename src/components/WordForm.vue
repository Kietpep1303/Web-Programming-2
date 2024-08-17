<template>
  <form action="#" @submit.prevent="onSubmit">
    <p v-if="errorsPresent" class="error">Please fill out all fields!</p>
    <p v-if="duplicateError" class="error">This word already exists in the dictionary!</p>
    
    <div class="ui labeled input fluid">
      <div class="ui label">
        <i class="germany flag"></i> German
      </div>
      <input type="text" placeholder="Enter word..." v-model="word.german" />
    </div>
    
    <div class="ui labeled input fluid">
      <div class="ui label">
        <i class="united kingdom flag"></i> English
      </div>
      <input type="text" placeholder="Enter word..." v-model="word.english" />
    </div>
    
    <div class="ui labeled input fluid">
      <div class="ui label">
        <i class="france flag"></i> French
      </div>
      <input type="text" placeholder="Enter word..." v-model="word.french" />
    </div>
    
    <button class="positive ui button">Submit</button>
  </form>
</template>

<script>
import { api } from '../helpers/helpers';

export default {
  name: 'word-form',
  props: {
    word: {
      type: Object,
      required: false,
      default: () => {
        return {
          english: '',
          german: '',
          french: ''
        };
      }
    }
  },
  data() {
    return {
      errorsPresent: false,
      duplicateError: false 
    };
  },
  methods: {
    async onCreateWord() {
  try {
    const newWord = {
      english: this.word.english,
      german: this.word.german,
      french: this.word.french
    };

    await api.createWord(newWord);

    this.word.english = '';
    this.word.german = '';
    this.word.french = '';

    this.$emit('wordAdded', newWord);

  } catch (error) {
      if (error.response && error.response.status === 400) {
        this.duplicateError = true; 
      } else {
        this.flash('An error occurred. Please try again.', 'error');
      }
      return;
  }
},
    async onSubmit() {
      // Reset errors before validating
      this.errorsPresent = false;

      // Check if any fields are empty
      if (this.word.english === '' || this.word.german === '' || this.word.french === '') {
        this.errorsPresent = true;
      } else {
        // Call the async onCreateWord method
        await this.onCreateWord();
      }
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>