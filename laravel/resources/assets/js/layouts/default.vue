<template>
  <div class="wrapper">
    <navbar/>
    <aside class="main-sidebar">
      <sidebar/>
    </aside>
    <div class="content-wrapper">
      <child/>
    </div>
    <footer class="main-footer">
      <Footerbar/>
    </footer>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'
import Footerbar from '../components/Footerbar.vue'

export default {
  name: 'MainLayout',

  components: {
    Navbar,
    Sidebar,
    Footerbar
  }
}
</script>
