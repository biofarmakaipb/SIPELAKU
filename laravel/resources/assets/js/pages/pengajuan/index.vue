<template>
    <section class="content">
        <div class="modal fade" id="modal-edit">
            <div class="modal-dialog" style="margin-top:150px">
                <div class="modal-content">
                <form  @submit.prevent="storePengajuan">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Masukan ke Transaksi Proyek</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Keterangan</label>
                        <textarea v-model="form.keterangan" class="form-control" rows="3" placeholder="Isikan Keterangan ..." required></textarea>
                    </div> 
                    <div class="form-group">
                        <label>Nominal</label>
                        <money class="form-control money-text-right" v-model="form.nominal" required/>
                    </div>
                    <div class="form-group">
                        <label>Tipe Nominal</label>
                        <select class="form-control" v-model="form.nominalType" required>
                            <option value="d">Debit</option>
                            <option value="k">Kredit</option>
                        </select>
                    </div>
                    <div class="form-group" v-if="form.nominalType!=null">
                        <label v-if="form.nominalType == 'd' && form.nominalType!=null">Simpan ke Bank</label>
                        <label v-if="form.nominalType == 'k' && form.nominalType!=null">Ambil dari Bank</label>
                        <div class="input-group">
                            <span class="input-group-addon">
                            <input type="checkbox" v-model="form.isInvolvedBank">
                            </span>
                            <v-select ref="select" :disabled="!form.isInvolvedBank" v-model="form.idSimpanan" :options="simpananOptions" @search:focus="maybeLoadSimpanan"/>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>
                    <v-button :type="'primary'" :loading="form.busy">Simpan</v-button>
                </div>
                </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="box box-info">
                    <div class="box-header with-border">
                        <h3 class="box-title">Daftar Pengajuan Penggunaan Dana</h3>
                    </div>
                    <!-- /.box-header -->
                    <div v-if="isloading" class="overlay">
                        <i class="fa fa-refresh fa-spin"></i>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="col-xs-12 col-md-12">
                                <div class="table-responsive">
                                    <table class="table no-margin">
                                        <thead>
                                        <tr>
                                        <th>Tanggal</th>
                                        <th>Pemohon</th>
                                        <th>Proyek</th>
                                        <th>Total</th>
                                        <th>Aksi</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <template v-if="!empty" v-for="(item, i) in indexList[currentPage]">
                                                <tr>
                                                    <td>{{ filteredData[item].tanggal }}</td>
                                                    <td>{{ filteredData[item].pegawai }}</td>
                                                    <td v-if="filteredData[item].kategori.length > 17" data-toggle="tooltip" :title="filteredData[item].kategori">{{ filteredData[item].kategori.substring(0,17) }}...</td>
                                                    <td v-if="filteredData[item].kategori.length <= 17">{{ filteredData[item].kategori }}</td>
                                                    <td>{{ filteredData[item].total | currency}}</td>
                                                    <td>
                                                        <span style="cursor:pointer" class="label label-success" @click="showDetail(item)">Lihat Detail</span>
                                                        <span style="cursor:pointer" class="label label-primary" @click="downloadPdf(item)">Download Pdf</span>
                                                    </td>
                                                </tr>
                                        </template>
                                        </tbody>
                                    </table>
                                    <p v-if="empty" style="text-align:center"> No Records Found. </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="box-footer clearfix">
                        <ul class="pagination pagination-sm no-margin">
                            <li :class="{'disabled':currentPage == 0}" style="cursor:pointer" @click="changePage(currentPage-1)"><a>«</a></li>
                            <template v-for="n in page">
                                <li :class="{'disabled':currentPage == n-1}" style="cursor:pointer" @click="changePage(n-1)"><a>{{ n }}</a></li>
                            </template>
                            <li :class="{'disabled':currentPage == page-1}" style="cursor:pointer" @click="changePage(currentPage-1)"><a>»</a></li>
                        </ul>
                        <!--<button v-if="!empty" class="btn btn-primary pull-right" @click="downloadPdf" >Download Pdf</button>-->
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="box box-info">
                    <div class="box-header with-border">
                        <h3 class="box-title">Daftar Barang</h3>
                    </div>
                    <!-- /.box-header -->
                    <div v-if="isFormSubmited" class="overlay">
                        <i class="fa fa-refresh fa-spin"></i>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="col-xs-12 col-md-12">
                                <div class="table-responsive">
                                    <table class="table no-margin">
                                        <thead>
                                        <tr>
                                        <th>Keterangan</th>
                                        <th>Jumlah</th>
                                        <th>Unit</th>
                                        <th>Perkiraan Biaya</th>
                                        <th>Sub Total</th>
                                        <th>Aksi</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <template v-if="indexItem!=null" v-for="(item, i) in detailData">
                                                <tr>
                                                    <td class="keterangan">{{ item.keterangan }}</td>
                                                    <td>{{ item.jumlah }}</td>
                                                    <td>{{ item.unit }}</td>
                                                    <td>{{ item.perkiraan_biaya | currency}}</td>
                                                    <td>{{ item.nominal | currency}}</td>
                                                    <td>
                                                        <span style="cursor:pointer" class="label label-success" @click="edit(i)">Simpan</span>
                                                        <span style="cursor:pointer" class="label label-danger" @click="deleteAlert(i)">Hapus</span>
                                                    </td>
                                                </tr>
                                        </template>
                                        </tbody>
                                    </table>
                                    <p v-if="indexItem==null" style="text-align:center"> No Records Found. </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="empty || filteredData.length <= 5" style="margin-bottom:300px"></div>
    </section>
</template>

<script>
    import Form from 'vform'
    import Cookies from 'js-cookie'
    export default {
        layout: 'default',
        props: {
            hidden:{
                type: Boolean,
                default: true
            }
        },
        data: () => ({
            isloading: false,
            success : 'success',
            isEdit : false,
            bankChecked: false,
            tahun: new Date().getFullYear(),
            disDate: null,
            form: new Form({
                idTransaksi: 0,
                idProyek:null,
                idPegawai:null,
                tanggal:null,
                perkiraanBiaya: 0,
                jumlah: 0,
                unit: null,
                keterangan: null,
                subTotal:0,
                tanggal: null,
                nominal: 0,
                nominalType: null,
            }),
            options: [],
            tanggal: new Date(),
            proyekDisabled: true,
            proyekOptions: [],
            simpananOptions:[],
            peneliti: null,
            proyek: null,
            search: null,
            list: [],
            page: 0,
            currentPage: 0,
            indexList: [],
            seq: [],
            limit: 10,
            filteredData: [],
            detailData: [],
            empty: true,
            indexItem: null,
            isFormSubmited: false,
            indexOfBarang: null,
        }),
        created(){
            Cookies.set('p', 1, { expires: null })
            this.disableDate()
            this.getAllPenggunaanDana()
        },
        methods: {  
            disableDate(){
                this.disDate = {
                    from: new Date()
                }
            },
            loadData: function(loadStatus){
                this.getAllPenggunaanDana(this.proyek['value'])
            },
            edit: function(i){
                this.form.idTransaksi = this.filteredData[this.indexItem].item[i].id
                this.form.keterangan = this.filteredData[this.indexItem].item[i].keteranganFull
                this.form.perkiraanBiaya = this.filteredData[this.indexItem].item[i].perkiraan_biaya
                this.form.jumlah = this.filteredData[this.indexItem].item[i].jumlah
                this.form.unit = this.filteredData[this.indexItem].item[i].unit
                this.form.subTotal = this.filteredData[this.indexItem].total
                this.form.idPegawai = null
                this.form.idProyek = null
                this.form.nominal = this.filteredData[this.indexItem].item[i].nominal
                this.indexOfBarang = i
                this.isEdit = true
                $("#modal-edit").modal('show')  
            },
            showTambah(){
                this.isEdit = false
                this.form.idPegawai = this.filteredData[this.indexItem].id_pegawai
                this.form.idProyek = this.filteredData[this.indexItem].id_proyek
                this.form.tanggal = this.filteredData[this.indexItem].tanggal
                $("#modal-edit").modal('show') 
            },
            submitEditOrTambah(){
                if(this.isEdit){
                    this.storeEditItem()
                }else{
                    this.storeNewItem()
                }
            },
            deleteAlert(i){
                this.form.reset()
                this.form.idTransaksi = this.filteredData[this.indexItem].item[i].id
                this.$swal({
                    title: 'Hapus Pengajuan '+this.filteredData[this.indexItem].item[i].keteranganFull+' Pada tanggal '+ this.filteredData[this.indexItem].item[i].tanggal + '?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Hapus',
                    cancelButtonText: 'Batal'
                    }).then((result) => {
                        if (result.value) {
                            this.submitDelete(i)        
                        }
                })   
            },
            changePerkiraan: function(event){
                if(this.form.jumlah > 0){
                    this.form.subTotal = this.form.jumlah * this.form.perkiraanBiaya
                }else{
                    this.form.subTotal = this.form.perkiraanBiaya
                }
            },
            showDetail(i){
                this.indexItem = i
                this.detailData = this.filteredData[i].item
            },
            changeTotal(){
                this.filteredData[this.indexItem].total -= this.filteredData[this.indexItem].item[this.indexOfBarang].nominal
                this.filteredData[this.indexItem].total += this.form.subTotal
            },
            storeEditItem(){
                $("#modal-edit").modal('hide')
                this.isFormSubmited = true
                let url = './api/pengajuandanaproyek/edit'
                this.form.patch(url)
                    .then(({data})=>{
                        this.isFormSubmited = false
                        if(this.filteredData[this.indexItem].item[this.indexOfBarang].nominal != this.form.subTotal){
                            this.changeTotal()
                        }
                        this.filteredData[this.indexItem].item[this.indexOfBarang].keterangan = this.form.keterangan
                        this.filteredData[this.indexItem].item[this.indexOfBarang].jumlah = this.form.jumlah
                        this.filteredData[this.indexItem].item[this.indexOfBarang].unit = this.form.unit
                        this.filteredData[this.indexItem].item[this.indexOfBarang].perkiraan_biaya = this.form.perkiraanBiaya
                        this.filteredData[this.indexItem].item[this.indexOfBarang].nominal = this.form.subTotal
                    })
                    .catch(err => console.log(err));
            },
            storeNewItem(){
                $("#modal-edit").modal('hide')
                this.isFormSubmited = true
                let url = './api/pengajuandanaproyek/tambahitem'
                console.log(this.form)
                this.form.post(url)
                    .then(({data})=>{
                        this.isFormSubmited = false
                        this.filteredData[this.indexItem].item.push({
                            'keterangan': this.form.keterangan,
                            'jumlah': this.form.jumlah,
                            'unit': this.form.unit,
                            'perkiraan_biaya': this.form.perkiraanBiaya,
                            'nominal': this.form.subTotal,
                            'idTransaksi': data.id,
                            'keteranganFull': this.form.jumlah != 0 ? this.form.keterangan + ' ' + this.form.jumlah
                                              + ' ' + this.form.unit + ' x ' + this.form.perkiraanBiaya :
                                              this.form.keterangan,
                            'tanggal': this.filteredData[this.indexItem].tanggal
                        })
                        this.filteredData[this.indexItem].total += this.form.subTotal
                    })
                    .catch(err => console.log(err));
            },
            submitDelete(i){
                let url = './api/pengajuandana/delete'
                this.form.patch(url)
                    .then(({data})=>{
                        this.$swal(
                            'Terhapus!',
                            'Pengajuan '+this.filteredData[this.indexItem].item[i].keteranganFull+' Pada tanggal '+ this.filteredData[this.indexItem].item[i].tanggal+' telah berhasil dihapus.',
                            'success'
                        )
                        //this.indexList[this.currentPage].splice(this.idex,1)
                        this.list[this.indexItem].item.splice(i,1)
                        this.filteredData[this.indexItem].item.splice(i,1)
                        if(this.filteredData[this.indexItem].item.length == 0){
                            this.getAllPenggunaanDana();
                        }
                        this.makeEmpty()
                    })
                    .catch(err => console.log(err));
            },
            makeEmpty(){
                if(this.filteredData.length == 0){
                    this.empty = true
                }
            },
            changeKetua(value){
				this.peneliti = value
                if(this.peneliti != null){
                    this.proyekDisabled = false
                    
                }else{
                    this.proyekDisabled = true
                }
                this.proyekOptions = []
                this.proyek = null
			},
            loadOptions(){
				return this.options.length <= 0 ? this.populateOptions() : null
		    },
		    populateOptions(){
				let url = './api/transaksiproyek/getallpeneliti';
				let self = this
				this.$refs.select1.toggleLoading(true)
				fetch(url)
				  .then(res => res.json())
				  .then(res => {
					let data = res.data;
					for(var i = 0; i < data.length; i++){
						self.options.push({
							label : data[i].pegawai.nama,
							value : data[i].id_peneliti
						})
					}
					this.$refs.select1.toggleLoading(false)
				  })
				  .catch(err => console.log(err));
 		    },
            maybeLoadProyek(){
                return this.proyekOptions.length <= 0 ? this.populateProyekOptions() : null
            },
            maybeLoadSimpanan(){
                return this.simpananOptions.length <= 0 ? this.getAllSimpananList() : null
            },
            getAllSimpananList(){
                let url = './api/transaksibank/getallsimpananlistnoncash';
                let self = this
                this.$refs.select.toggleLoading(true)
                fetch(url)
                  .then(res => res.json())
                  .then(res => {
                    let data = res.data;
                    for(var i = 0; i < data.length; i++){
                        self.simpananOptions.push({
                            label : data[i]['nama_bank'],
                            value : data[i].id
                        })
                    }
                    this.$refs.select.toggleLoading(false)
                  })
                  .catch(err => console.log(err));
            },
            populateProyekOptions(){
                let url = './api/transaksiproyek/getallproyeklist?tahun='+this.tahun+'&idPeneliti='
							  +this.peneliti.value + '&options=true';
                let self = this
                this.$refs.select.toggleLoading(true)
                fetch(url)
                  .then(res => res.json())
                  .then(res => {
                    let data = res.data;
                    for(var i = 0; i < data.length; i++){
                        self.proyekOptions.push({
                            label : data[i]['nama_proyek'],
                            value : data[i].id
                        })
                    }
                    this.$refs.select.toggleLoading(false)
                  })
                  .catch(err => console.log(err));
            },
            submitSearch(){
                this.filteredData = this.list.filter(data => data.keterangan.toLowerCase().indexOf(this.search.toLowerCase(),0) != -1 &&  data.pegawai != '')
                this.createPagination()
            },
            getAllPenggunaanDana(proyek){
                this.isloading = true
                let tgl = this.tanggal
                let dt =  (tgl.getMonth()+1) + '/' + tgl.getDate() + '/' + tgl.getFullYear()
                let url = proyek == null? './api/pengajuandanaproyek/fetch' 
                    : './api/pengajuandanaproyek/fetch?idProyek='+proyek+'&tanggal='+dt
                let self = this
                console.log(dt)
                console.log(this.tanggal)
                fetch(url)
                    .then(res => res.json())
                    .then(res => {
                    let data = res.data;
                    if(!res.empty){
                        this.list = data;
                        this.isloading = false
                        this.empty = false
                    }
                    else{
                        this.list = [];
                        this.isloading = false
                        this.empty = true
                    }
                    this.filteredData = this.list;
                    this.createPagination();
                    })
                    .catch(err => console.log(err));
            },
            downloadPdf(i){
                var dlForm = new Form({
                    transaksiList : []
                })
                for(var index=0; index<this.filteredData[i].item.length; index++){
                    dlForm.transaksiList[index] = this.filteredData[i].item[index].id
                }
                let url = './api/asisten/pengajuan/downloadpdf'
                dlForm.post(url)
            },
            createPagination(){
                this.page = Math.ceil(this.filteredData.length/this.limit);
                this.seq = Array.from(new Array(this.filteredData.length),(val,index)=>index);
                this.indexList = []
                for(var i = 0; i<this.page; i++){
                    this.indexList.push(this.seq.splice(0,this.limit))
                }
                this.currentPage = this.page-1
            },
            storePengajuan(){
                let url = './api/pengajuandanaproyek/store'
                this.form.post(url)
                    .then(({data})=>{
                        this.$swal(
                            'Tersimpan!',
                            'Transaksi '+this.form.keterangan+' telah berhasil disimpan.',
                            'success'
                        )
                        $("#modal-edit").modal('hide')
                        this.form.reset()
                        let proyek = this.proyek == null ? null : this.proyek['value']
                        this.list[this.indexItem].item.splice(this.indexOfBarang,1)
                        this.filteredData[this.indexItem].item.splice(this.indexOfBarang,1)
                        if(this.filteredData[this.indexItem].item.length == 0){
                            this.getAllPenggunaanDana();
                        }
                    }) 
            }
        }
    }
</script>
<style>
.v-select .dropdown-toggle {
    display: flex !important;
}
.v-select .selected-tag {
    overflow: hidden;
    text-overflow: ellipsis; 
    width: 600%;
}
.v-select input {
    width: 100% !important;
}
.validation {
  position: absolute;
  width: calc(100% - 1px); height: calc(100% - 1px);
  border: none;
  border-radius: 5px;
  background: none;
  left: 0%; bottom: 0;
  z-index: -1;
  opacity: 0;
}
.bg-datepicker {
    background-color: #ffffff !important;
}
.money-text-right {
    text-align: right;
}
</style>