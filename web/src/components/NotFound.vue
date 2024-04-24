<template>
    <div class="flex flex-col items-center justify-center h-screen">
      <h1 class="mb-4 text-4xl font-bold">404 - Page Not Found</h1>
      <p class="mb-8 text-lg">Oops! The page you're looking for doesn't exist.</p>
      <router-link to="/" class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
        Go Back Home
      </router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound',
  }
  </script>