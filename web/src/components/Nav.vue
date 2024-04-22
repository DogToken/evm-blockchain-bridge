<template>
  <div
    class="flex flex-wrap items-center justify-around my-8 md:justify-center"
  >
    <router-link
      :to="{ name: 'Home' }"
      class="block px-3 py-2 mr-0 text-base font-medium border border-blue-600 rounded-md md:mr-4"
      :class="
        $route.name == 'Home'
          ? 'bg-blue-600 text-white b'
          : 'bg-blue-100 text-blue-800 '
      "
      aria-current="page"
      >Bridge to Polygon</router-link
    >

    <router-link
      :to="{ name: 'Destination' }"
      class="block px-3 py-2 text-base font-medium border border-teal-600 rounded-md"
      :class="
        $route.name == 'Destination'
          ? 'bg-teal-600 text-white'
          : 'bg-teal-100 text-teal-800'
      "
      aria-current="page"
      >Send token back to MintMe</router-link
    >
  </div>
</template>
