const Welcome = () => import('~/pages/welcome').then(m => m.default || m)
const Admin = () => import('~/pages/admin').then(m => m.default || m)
const Login = () => import('~/pages/auth/login').then(m => m.default || m)
const Register = () => import('~/pages/auth/register').then(m => m.default || m)
const PasswordEmail = () => import('~/pages/auth/password/email').then(m => m.default || m)
const PasswordReset = () => import('~/pages/auth/password/reset').then(m => m.default || m)
const NotFound = () => import('~/pages/errors/404').then(m => m.default || m)

const Home = () => import('~/pages/home').then(m => m.default || m)
const Settings = () => import('~/pages/settings/index').then(m => m.default || m)
const SettingsProfile = () => import('~/pages/settings/profile').then(m => m.default || m)
const SettingsPassword = () => import('~/pages/settings/password').then(m => m.default || m)

//Transaksi routes
const Transaksiumum = () => import('~/pages/transaksi/umum/index').then(m => m.default || m)
const Transaksibank = () => import('~/pages/transaksi/bank/index').then(m => m.default || m)
const Transaksiunit = () => import('~/pages/transaksi/unit/index').then(m => m.default || m)

const Transaksi = () => import('~/pages/transaksi/index').then(m => m.default || m)

//Kategori umum
const Kategori = () => import('~/pages/kategori/index').then(m => m.default || m)

//Simpanan
const Simpanan = () => import('~/pages/simpanan/index').then(m => m.default || m)

const TransaksiProyek = () => import('~/pages/transaksi/proyek/index').then(m => m.default || m)

const Pengajuan = () => import('~/pages/pengajuan/index').then(m => m.default || m)

const AsistenPengajuan = () => import('~/pages/pengajuan/proyek/index').then(m => m.default || m)

const Proyek = () => import('~/pages/proyek/index').then(m => m.default || m)

const Unit = () => import('~/pages/unit/index').then(m => m.default || m)

const Rekap = () => import('../pages/Rekap/index.vue').then(m => m.default || m)

const Dashboard = () => import('~/pages/dashboard/dashboard').then(m => m.default || m)

const TambahPengajuan = () => import('~/pages/asisten/tambahpengajuan').then(m => m.default || m)

export default [
  { path: '/', name: 'welcome', component: Welcome },

  { path: '/login', name: 'login', component: Login },
  { path: '/admin', name: 'admin', component: Admin },
  { path: '/riwayat/transaksi-umum', name: 'transaksiumum', component: Transaksiumum },
  { path: '/riwayat/transaksi-bank', name: 'transaksibank', component: Transaksibank },
  { path: '/riwayat/transaksi-unit', name: 'transaksiunit', component: Transaksiunit },
  { path: '/transaksi', name: 'transaksi', component: Transaksi },
  { path: '/pengajuan-penggunaan-dana', name: 'pengajuan', component: Pengajuan },
  { path: '/daftar-penggunaan-dana', name: 'asistenpengajuan', component: AsistenPengajuan },
  { path: '/kategori-transaksi', name: 'kategori', component: Kategori },
  { path: '/riwayat/transaksi-proyek', name: 'transaksiproyek', component: TransaksiProyek },
  { path: '/simpanan', name: 'simpanan', component: Simpanan },
  { path: '/register', name: 'register', component: Register },
  { path: '/password/reset', name: 'password.request', component: PasswordEmail },
  { path: '/password/reset/:token', name: 'password.reset', component: PasswordReset },
  { path: '/proyek', name: 'proyek', component: Proyek },
  { path: '/unit', name: 'unit', component: Unit },
  { path:'/rekap', name:'rekap', component: Rekap },
  { path: '/home', name: 'home', component: Home },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/tambah-pengajuan', name: 'tambahpengajuan', component: TambahPengajuan },
  { path: '/settings',
    component: Settings,
    children: [
      { path: '', redirect: { name: 'settings.profile' } },
      { path: 'profile', name: 'settings.profile', component: SettingsProfile },
      { path: 'password', name: 'settings.password', component: SettingsPassword }
    ] },

  { path: '*',name: 'not-found', component: NotFound }
]
