<template>
<div class="row">
  <div class="col-md-5 middle">
    <div class="box box-widget widget-user-2">
      <!-- Add the bg color to the header using any of the bg-* classes -->
      <div class="widget-user-header bg-white">
        <div class="widget-user-image">
          <img class="img-circle" src="/Foto/ipb.png" alt="User Avatar">
        </div>
        <!-- /.widget-user-image -->
        <h3 class="widget-user-username">{{ $t('login') }}</h3>
        <h5 class="widget-user-desc">SIPELAKEU Biofarmaka Tropika IPB</h5>
      </div>
      <div class="box-footer">
        <form @submit.prevent="login" @keydown="form.onKeydown($event)">
          <ul class="nav">
            <li class="col-md-12">
              <div class="form-group">
                <input v-model="form.email" :class="{ 'is-invalid': form.errors.has('email') }" :placeholder="$t('email')" class="form-control" type="email" name="email" required>
                <has-error :form="form" field="email"/>
              </div>
            </li>
            <li class="col-md-12">
              <div class="form-group">
                <input v-model="form.password" :class="{ 'is-invalid': form.errors.has('password') }" :placeholder="$t('password')" class="form-control" type="password" name="password" required>
                <has-error :form="form" field="password"/>
              </div>
            </li>
          </ul>
          <div class="col-md-12">
            <div class="form-group row">
                <div class="col-md-7 offset-md-3 d-flex">
                  <!-- Submit Button -->
                  <v-button :loading="form.busy">
                    {{ $t('login') }}
                  </v-button>
                </div>
            </div>
            <a href="api/download/userguide" >Download Panduan Penggunaan</a>
          </div>
        </form>
      </div>
    </div>
    
  </div>
</div>
</template>

<script>
import Form from 'vform'
import LoginWithGithub from '~/components/LoginWithGithub'
import Cookies from 'js-cookie'
export default {
  middleware: 'guest',
  layout:'basic',

  components: {
    LoginWithGithub
  },

  metaInfo () {
    return { title: this.$t('login') }
  },

  data: () => ({
    form: new Form({
      email: '',
      password: ''
    }),
    remember: false
  }),

  methods: {
    async login () {
      // Submit the form.
      const { data } = await this.form.post('./api/login')
      console.log(typeof data.error)
      if(typeof data.error == "undefined"){
        // Save the token.
        this.$store.dispatch('auth/saveToken', {
          token: data.token,
          remember: this.remember
        })

        // Fetch the user.
        await this.$store.dispatch('auth/fetchUser')
        console.log(this.$store.getters['auth/user'])
		this.$toasted.success('<i class="fa fa-check"></i>Logged in').goAway(1000)
        if (this.$store.getters['auth/user']['user_role_s_i'][0].id_role === 8) {
          // Redirect transaksi.
          this.$router.push({ name: 'transaksi' })
          Cookies.set('p', 0, { expires: null })
        }else if (this.$store.getters['auth/user']['user_role_s_i'][0].id_role === 3) {
          // Redirect home.
          this.$router.push({ name: 'dashboard' })
        }else if (this.$store.getters['auth/user']['user_role_s_i'][0].id_role === 9) {
          // Redirect home.
          Cookies.set('p', 0, { expires: null })
          this.$router.push({ name: 'tambahpengajuan' })
        }
      }
      else{
        console.log(data)
      }
    }
  }
}
</script>
<style>
  .middle{
    margin: 11% 25%;
  }  
</style>