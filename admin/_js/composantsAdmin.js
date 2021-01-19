//LES COMPOSANTS
//Composants de formulaire
let catSelector = {
    props:['listeCats'],
    data(){
        return{
        }
    },
    computed:{
        _listeCats: function(){
            return this.listeCats;
        }
    },
    methods:{
        returnCat: function(){
            this.$emit('changeCat', this.$refs.catSelector.value);
        }
    },
    template:`
    <div class="form-group border-bottom pb-3">
        <label for="catSelector">Pour commencer :</label>
        <select v-on:change="returnCat()" 
        ref="catSelector"
        id="catSelector"
        class="form-control">
            <option value="none">Choisissez une catégorie...</option>
            <option v-for="(item,index) in _listeCats" :key="index" v-bind:value="index">{{index + 1}} - {{item.cat}}</option>
        </select>
    </div> `
};

var txt_court = {
    props:{
        chp_titre:{
            type: String,
            required: true
        },
        chp_contenu:{
            type: String,
            required: true
        },
    },
    data: function(){
        return{
            txt: this.chp_contenu,
            titre: this.chp_titre
        }
    },
    watch:{
        chp_contenu: function(){
            this.txt = this.chp_contenu;
        },
        chp_titre: function(){
            this.titre = this.chp_titre;
        },
    },
    methods:{
        emit:function(e){
            this.$emit('modif', this.$refs.txt_courtInput.value);
        },
    },
    template: `
    <div class="form-group">
        <label><strong>{{titre}}</strong></label>
        <input type="text" v-model="txt" @input="emit" class="form-control" ref="txt_courtInput">
    </div>`
};

var txt_long = { //C'est bon ça markdown en direct
    props:{
        chp_titre:{
            type: String,
            required: true
        },
        chp_contenu:{
            type: String,
            required: true
        },
    },
    data: function(){
        return{
            txt: this.chp_contenu,
            titre: this.chp_titre,
        }
    },
    computed:{
        //Markdownage en direct, toi même du sais
        compiledMarkdown: function () {
          return marked(this.txt, { sanitize: true })
        }
    },
    watch:{
        chp_contenu: function(){
            this.txt = this.chp_contenu;
        },
        chp_titre: function(){
            this.titre = this.chp_titre;
        },
    },
    methods:{
        emit: function(e){
            this.$emit('modif', this.$refs.txt_longInput.value);
        },
        /*update: _.debounce(function (e) { //PROVOQUE UN MESSAGE D'ERREUR. Ne sert, à priori, qu'à temporiser la màj de l'aperçu Markdown, donc bon...
          this._txt = e.target.value
        }, 150)*/
    }, 
    template: `
    <div class="form-group row">
        <div class="col-lg-6 pb-3">
            <label><strong>{{titre}}</strong></label>
            <textarea v-model="txt" ref="txt_longInput" class="col form-control" rows="10" @input="emit">{{txt}}
            </textarea>
            <em class="small">Ces champs sont compilés en markdown.<br>
            Pour connaître les raccourcis utilisables, consultez
            <a href="https://www.christopheducamp.com/2014/09/18/love-markdown/" alt="mode d'emploi Markdown" target="_blank">ce lien.</a></em>
        </div>
        <div class="col-lg-6">
            <label><em>Aperçu Markdowné :</em></label>
            <div v-html="compiledMarkdown" class="overflow-auto" style="max-height:31vh;"></div>
        </div>
    </div>`
};

var liste_infos = {
    props:{
        chp_titre:{
            type: String,
            required: true
        },
        chp_contenu:{
            type: Array,
            required: true
        },
    },
    data: function(){
        return{
            liste_infos:this.chp_contenu,
            titre: this.chp_titre,
        }
    },
    watch:{
        chp_contenu: function(){
            this.liste_infos = this.chp_contenu;
        },
        chp_titre: function(){
            this.titre = this.chp_titre;
        },
    },
    methods:{
        ajt_chpInfos: function(){
            this.liste_infos.push({infos: ''});
        },
        supprInfo: function(index){
            this.liste_infos.splice(index,1);
        }
    },
    template: `
        <div class="form-group">
            <div>
                <label><strong>{{titre}}</strong></label>
            </div>
            <div class="liste_infos row no-gutters align-items-center pb-2 mb-2 border-bottom" v-for="(info,index) in liste_infos" :key="index">
                <label class="col-sm-0 mr-3 my-0">{{index + 1}} : </label>
                <input type="text" class="form-control col-md-5 mr-3 px-2" placeholder="Ex: Format: 16 x 25 cm" v-model="info.infos">
                <button type="button" class="btn btn-danger" v-on:click="supprInfo(index)">X</button>
            </div>
            <button type="button" class="btn btn-secondary" v-on:click="ajt_chpInfos()">Ajouter</button>
        </div> `
};

var liste_reseaux = {
    props:{
        chp_titre:{
            type:String,
            required:true
        },
        chp_contenu:{
            type: Array,
            required: true
        },
        ex_name:{
            type:String,
            required:true
        },
        ex_content:{
            type:String,
            required:true
        },
    },
    data: function(){
        return{
            titre: this.chp_titre,
            liste_reseaux:this.chp_contenu,
        }
    },
    watch:{
        chp_contenu: function(){
            this.liste_reseaux = this.chp_contenu;
        },
    },
    methods:{
        ajt_chpReseaux: function(){
            this.liste_reseaux.push({'name':'', 'content':'',});
        },
        supprReseau: function(index){
            this.liste_reseaux.splice(index,1);
        }
    },
    template: `
        <div>
            <div>
                <label><strong>{{titre}}</strong></label>
            </div>

            <div class="liste_infos row no-gutters align-items-center pb-2 mb-2 border-bottom" v-for="(reseau,index) in liste_reseaux" :key="index">
                <label class="col-sm-0 mr-3 my-0">{{index + 1}} : </label>
                <input type="text" class="form-control col-lg-3 mr-3 px-2" v-bind:placeholder="ex_name" v-model="reseau.name">
                <input type="text" class="form-control col-lg-3 mr-3 px-2" v-bind:placeholder="ex_content" v-model="reseau.content">
                <button type="button" class="btn btn-danger" v-on:click="supprReseau(index)">X</button>
            </div>
            <button type="button" class="btn btn-secondary" v-on:click="ajt_chpReseaux()">Ajouter</button>
        </div> `
};

var insert_iframeMedia = {
    props:{
        _index:{
            type:Number,
            required:true
        },
        _url:{
            type:String,
            required:true,
        },
    },
    data(){
        return{
            validation: "En attente du lien...",
            url: this._url,
            index: this._index
        }
    },
    watch:{
        _url: function(){
            this.url = this._url;
            this.verifierLien(this.url);
        }
    },
    mounted:function(){
        this.verifierLien(this.url);
    },
    methods:{ //Le this est en fait le composant lui-même
        verifierLien: function(url){
            var regLiens = /^<iframe.+src\=\".+(youtube\.com|vimeo\.com|dailymotion\.com|bandcamp\.com|soundcloud\.com).+<\/iframe>/; //La regex de test

            if(regLiens.test(url)){
                this.$refs.iframeMedia.innerHTML = url;
                this.$emit('urlOk', url);
            } else {
                this.$refs.iframeMedia.textContent = "Site non autorisé";
            } 
        }
    },
    template: `
    <div class="col align-items-center">
            <div ref="iframeMedia" class="col mr-3 my-0">{{validation}}</div>
        <input type="text" placeholder="Insérez ici le lien iframe" ref="inputMedia" v-on:input="verifierLien(url)" v-on:load="verifierLien()" v-model="url" class="col form-control mr-3 px-2">
    </div> `
};

var media = {
    props:{
        chp_titre:{
            type: String,
            required: true
        },
        chp_contenu:{
            type: Array,
            required: true
        },
    },
    data: function(){ //Les datas de chaque composant media
        return{ //présentés sous forme d'une fonction pour être indépendants
            liste_liensMedia:this.chp_contenu,
            titre: this.chp_titre,
        }
    },
    components:{
        'insert_iframeMedia':insert_iframeMedia,
    },
    watch:{
        chp_contenu: function(){
            this.txt = this.chp_contenu;
        },
        chp_titre: function(){
            this.titre = this.chp_titre;
        },
    },
    methods: {
        ajt_chpMedia: function(){ //C'est ce qui ajoute un champ, magie
            this.liste_liensMedia.push({'url_media': ''}); //On rajoute un champ avec un id mais un contenu vide au tableau
        },
        addUrl: function(lienMedia, index){
            this.liste_liensMedia[index].url_media = lienMedia;
        },
        supprMedia: function(index){
             
            this.liste_liensMedia.splice(index,1);
             
        }
    },
    template: ` 
    <div class="form-group">
        <div>
            <label><strong>{{titre}}</strong></label>
        </div>

        <div v-for="(url_media, index) in liste_liensMedia" :key="index" class="row no-gutters align-items-center pb-2 mb-2 border-bottom">
            <insert_iframeMedia v-bind:_url="url_media.url_media" v-bind:_index="index" v-on:urlOk="addUrl($event,index)"></insert_iframeMedia>
            <button type="button" class="btn btn-danger" v-on:click="supprMedia(index)" style="height:100%;">X</button>
        </div>
        <button type="button" class="btn btn-secondary" v-on:click="ajt_chpMedia()">Ajouter</button>
    </div> `
};

var upl_fchs = {
    props:{
        prjt_titre:{
            type: String,
            required: true,
        },
        prjt_cat:{
            type:String,
            required:true,
        },
        prjt_cle:{
            type:String,
            required:true,
        },
        chp_titre:{
            type:String,
            required:true
        },
        chp_contenu:{
            type:Array,
            required: true
        }
    },
    data: function(){
        return{
            prjtTitre: this.prjt_titre,
            cat: this.prjt_cat,
            cle: this.prjt_cle,
            images: this.chp_contenu,
            titre: this.chp_titre,
        }
    },
    watch:{
        prjt_titre: function(){
            this.prjtTitre = this.prjt_titre;
        },
        prjt_cat: function(){
            this.cat = this.prjt_cat;
        },
        prjt_cle: function(){
            this.cle = this.prjt_cle;
        },
        chp_contenu: function(){
            this.images = this.chp_contenu;
        },
        chp_titre: function(){
            this.titre = this.chp_titre;
        },
    },
    methods:{
        returnFileSize: function(number){
            if(number < 1024) {
                return number + ' octets';
              } else if(number >= 1024 && number < 1048576) {
                return (number/1024).toFixed(1) + ' Ko';
              } else if(number >= 1048576) {
                return (number/1048576).toFixed(1) + ' Mo';
              }
        },
        uplImgs:function(){
            this.$refs.file.click();
        },
        handleFileUpload: function(){
            for(let i = 0; i < this.$refs.file.files.length; i++){
                let formData = new FormData();

                formData.set('prjt_cle', this.cle);
                formData.set('prjt_cat', 'cat_'+this.cat);
                formData.set('fichier', this.$refs.file.files[i]);

                ajaxPost('_php/upl_fchs.php', formData, (retour) => {
                    if(retour){
                        this.images.push({
                            'name':this.$refs.file.files[i].name, 
                            'size': this.returnFileSize(this.$refs.file.files[i].size), 'ext':this.$refs.file.files[0].name.slice((this.$refs.file.files[0].name.lastIndexOf(".") - 1 >>> 0) + 2),
                            'url': 'content/cat_'+this.cat+'/'+this.cle+'/'+this.$refs.file.files[i].name,
                            'thumbnail':false,
                            'show':true,
                        });
                        this.$emit("upload");
                    } else if(retour === "session_prblm"){
                        alert('Votre session a expirée, veuillez vous reconnecter');
                        document.location.reload(true);
                    } else {
                        alert(retour);
                    }
                }, true);  
            }


        },
        supprFile: function(fileName, index){
            //Suppression effective des fichiers sur le serveur
            let formData = new FormData();
            formData.set('prjt_cle', this.cle);
            formData.set('prjt_cat', 'cat_'+this.cat);
            formData.set('fileName', fileName);
            ajaxPost("_php/suppr_fchs.php", formData, (retour) => {
                 
                this.images.splice(index, 1);
                this.$emit("upload");
            }, true);
        },
        creerMiniat: function(index, img, cle, cat){
            this.supprMiniat(index, cle, cat);
            
            let formData = new FormData();
            
            formData.set('image', '../'+img);
            formData.set('cle', cle);
            formData.set('cat', cat);
            ajaxPost("_php/creer_miniat.php", formData, (retour) => {
                for(var i= 0; i < this.images.length; i++){
                    if(i !== index){
                        this.images[i].thumbnail = false;
                    }
                }
                this.images[index].thumbnail = true;
                
                this.$emit('nvlleMiniat');
            }, true);
        },
        supprMiniat: function(index, cle, cat){
            let formData = new FormData();
            formData.set('cle', cle);
            formData.set('cat', cat);
            ajaxPost("_php/suppr_miniat.php", formData, (retour) => {
                console.log(retour);
            }, true);
            this.images[index].thumbnail = false;
            this.$emit('nvlleMiniat');
        },
        hideImg:function(index,img,cle,cat){
            let formData = new FormData();
            
            formData.set('image', img);
            formData.set('cle', cle);
            formData.set('cat', cat);
            
            ajaxPost("_php/hide_img.php", formData, (retour) => {
                console.log(retour);
                document.getElementById('img_'+img).style.opacity = 0.4;
                this.images[index].url = 'content/cat_'+cat+'/'+cle+'/hidden/'+img;
                this.images[index].show = false;
                this.$emit('upload');
            }, true);
        },
        showImg:function(index,img,cle,cat){
            let formData = new FormData();
            
            formData.set('image', img);
            formData.set('cle', cle);
            formData.set('cat', cat);
            
            ajaxPost("_php/show_img.php", formData, (retour) => {
                console.log(retour);
                document.getElementById('img_'+img).style.opacity = 1;
                this.images[index].url = 'content/cat_'+cat+'/'+cle+'/'+img;
                this.images[index].show = true;
                this.$emit('upload');
            }, true);
        }
    },
    template: `
    <div class="form-group">
        <label><strong>{{titre}}</strong></label>
        <div>
            <div class="row">
                <div v-for="(file, index) in images" 
                :key="index" ref="'upl_fch'+index"
                class="pb-2 mb-2 border-bottom col-6">
                    <div class="pb-1 mb-1">
                        <a :href="'../'+file.url" target="_blank">{{file.name}}</a> <em class="small">({{ file.size }})</em>
                    </div>
                    
                    <div class="row no-gutters">
                        <div v-if="file.show" class="col mr-2">
                            <div v-if="file.ext !== 'pdf' && file.ext !== 'PDF'">
                                <img :src="'../'+file.url" class="img-fluid img-thumbnail" :id="'img_'+file.name" style="max-height:10em;">
                            </div>

                            <div v-else>
                                <img src="../_css/pdf_icon.svg" class="img-fluid img-thumbnail" :id="'img_'+file.name" style="max-height:10em;">
                            </div>
                        </div>

                        <div v-else class="col mr-2">
                            <div v-if="file.ext !== 'pdf' && file.ext !== 'PDF'">
                                <img :src="'../'+file.url" class="img-fluid img-thumbnail" :id="'img_'+file.name" style="opacity:0.4; max-height:10em;">
                            </div>

                            <div v-else>
                                <img src="../_css/pdf_icon.svg" class="img-fluid img-thumbnail" :id="'img_'+file.name" style="opacity:0.4; max-height:10em;">
                            </div>
                        </div>
                        
                        <div class="col">
                            <div v-if="prjt_cat !== 'accueil' && prjt_cat !== 'apropos' ">
                                <button v-if="!file.thumbnail" 
                                ref="'miniat_'+index" 
                                type="button" class="btn btn-secondary mb-2 btn-sm col" 
                                v-on:click="creerMiniat(index, '../'+file.url, cle, cat)">
                                Utiliser l'image comme aperçu</button>

                                <button v-else
                                ref="'miniat_'+index" 
                                type="button" class="btn btn-secondary mb-2 btn-sm col" 
                                v-on:click="supprMiniat(index, cle, cat)">
                                Ne plus utiliser l'image comme aperçu</button>
                            </div>

                            <button v-if="file.show" 
                            ref="'hide_'+index" 
                            type="button" class="btn btn-secondary mb-2 btn-sm col" 
                            v-on:click="hideImg(index, file.name, cle, cat)">
                            Cacher l'image</button>

                            <button v-else
                            ref="'hide_'+index" 
                            type="button" class="btn btn-secondary mb-2 btn-sm col" 
                            v-on:click="showImg(index, file.name, cle, cat)">
                            Afficher l'image</button>

                            <br>

                            <button type="button" class="btn btn-danger btn-sm col" v-on:click="supprFile(file.name, index)">Supprimer l'image</button>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <input type="file" :id="'files_'+titre" ref="file" multiple style="display: none;" v-on:change="handleFileUpload()" />
                <input type="button" class="btn btn-secondary" value="Ajouter des images" v-on:click="uplImgs()" />
                <br>
                <span><strong>Attention:</strong> La taille maximum des fichiers par envoi : <strong>64Mo!</strong></span>
            </div>
        </div>
      </div> `
};

var upl_enTete = {
    props:{
        chp_contenu:{
            type:Array,
            required: true
        }
    },
    data: function(){
        return{
            images: this.chp_contenu,
        }
    },
    watch:{
        chp_contenu: function(){
            this.images = this.chp_contenu;
        },
    },
    methods:{
        returnFileSize: function(number){
            if(number < 1024) {
                return number + ' octets';
              } else if(number >= 1024 && number < 1048576) {
                return (number/1024).toFixed(1) + ' Ko';
              } else if(number >= 1048576) {
                return (number/1048576).toFixed(1) + ' Mo';
              }
        },
        handleFileUpload: function(){
                let formData = new FormData();

                formData.set('prjt_cle', 'params');
                formData.set('prjt_cat', 'params');
                formData.set('fichier', this.$refs.file.files[0]);

                ajaxPost('_php/upl_fchs.php', formData, (retour) => {   
                    if(retour){
                        this.images = [];
                        this.images.push({
                            'name':this.$refs.file.files[0].name, 
                            'size': this.returnFileSize(this.$refs.file.files[0].size),
                            'ext':this.$refs.file.files[0].name.slice((this.$refs.file.files[0].name.lastIndexOf(".") - 1 >>> 0) + 2),
                            'url': 'content/params/params/'+this.$refs.file.files[0].name,
                        });
                        console.log(this.images);
                         
                        this.$emit("upload", this.images);
                    } else {
                        alert(retour);
                    }
                }, true);
        },
        supprFile: function(fileName, index){
            let formData = new FormData();
            formData.set('prjt_cle', 'params');
            formData.set('prjt_cat', 'params');
            formData.set('fileName', fileName);
            ajaxPost("_php/suppr_fchs.php", formData, (retour) => {
                 
                this.images = [];
                this.$emit("upload", this.images);
            }, true);
        },
        uplImgs:function(){
            this.$refs.file.click();
        },
    },
    template: `
    <div>
        <label>Image d'en-tête de votre site :</label>

        <div>
            <div class="row">
                <div v-for="(file, index) in images" 
                :key="index" ref="'upl_fch'+index"
                class="pb-2 mb-2 border-bottom col-6">
                    <div class="pb-1 mb-1">
                        {{index + 1}} : {{file.name}} <em class="small">({{ file.size }})</em>
                    </div>

                    <div class="row no-gutters">
                        <div class="col mr-2">
                            <img :src="'../'+file.url" class="img-fluid img-thumbnail" :id="'img_'+file.name" style="max-height:20em;">
                        </div>

                        <div class="col">
                            <button type="button" class="btn btn-danger btn-sm col" v-on:click="supprFile(file.name, index)">Supprimer l'image</button>
                        </div>
                    </div>
                </div>
            </div>

            <div>
            <input type="file" ref="file" style="display: none;" v-on:change="handleFileUpload()" />
                <input type="button" class="btn btn-secondary" value="Choisissez votre en-tête" v-on:click="uplImgs()" />
                <br>
                <span><strong>Attention:</strong> La taille maximum des fichiers par envoi : <strong>64Mo!</strong></span>
            </div>
        </div>
    </div>`
};

var ajtChp = {
    methods:{
        addChp: function(){
            let nvChp = new Object();
            
            if(this.$refs.chp_titre.value === ""){
                nvChp.titre = 'Champ sans titre';
            } else {
                nvChp.titre = this.$refs.chp_titre.value;
            }
            
            if(this.$refs.chp_type.value !== "none"){
                nvChp.type = this.$refs.chp_type.value;
                
                if(nvChp.type == 'txt_court' || nvChp.type == 'txt_long'){
                    nvChp.contenu = "";
                } else{
                    nvChp.contenu = [];
                }
                
                this.$emit('addChp', nvChp);
            } else {
                alert("Choisissez d'abord quel type de champ ajouter!");
            }
        }
    },
    template:`
    <div class="form-group">
        <label>Ajouter un champ</label>
        <div class="row no-gutters">
        <input type="text" placeholder="nom du nouveau champ..." ref="chp_titre" class="form-control col mr-3 px-2">
        <select ref="chp_type" class="form-control col mr-3 px-2">
            <option value="none" selected>Choisissez un type de champ à ajouter</option>
            <option value="txt_court">texte court</option>
            <option value="txt_long">texte long</option>
            <option value="liste_infos">liste d'infos</option>
            <option value="media">média externe</option>
            <option value="upl_fchs">envoi de fichiers</option>
        </select>
        <button type="button" v-on:click="addChp()" class="btn btn-secondary">Ajouter un champ</button>
        </div>
    </div> `
};

var typeChp = {
    props:{
        _typeDefaut:{
            type:String,
            required:true
        }
    },
    data:function(){
        return{
            listeOptions: [
                {'value':'txt_court', 'label':'texte court'},
                {'value':'txt_long', 'label':'texte long'},
                {'value':'liste_infos', 'label':'liste d\'infos'},
                {'value':'media', 'label':'médias externes'},
                {'value':'upl_fchs', 'label':'envoi de fichiers'},
            ],
        }
    },
    mounted:function(){
        for(var i = 0; i < this.listeOptions.length; i++){
            if(this.listeOptions[i].value === this._typeDefaut){
                this.$refs.selectOptions.options[i].defaultSelected = "true";
            }
        }
    },
    watch:{
        _typeDefaut: function(){
            for(var i = 0; i < this.listeOptions.length; i++){
                if(this.listeOptions[i].value === this._typeDefaut){
                    this.$refs.selectOptions.options[i].defaultSelected = "true";
                }
            }
        }
    },
    template:`
    <select ref="selectOptions">
        <option v-for="(item,index) in listeOptions"
        :key="index"
        v-bind:value="item.value"
        >{{item.label}}</option>
    </select> `
};

var reinitMdp = {
    props:{
        _mdp:{
            type:Object,
            required:true,
        }
    },
    data:function(){
        return{
            mdp:this._mdp,
            showReinit: false,
        }
    },
    watch:{
        _mdp:function(){
            this.mdp = this._mdp;
        }
    },
    methods:{
        showReinitMdp:function(){
            if(this.showReinit){
                this.showReinit = false;
            }else{
                this.showReinit = true;
            }
        },
        watch_mdp:function(e){
            var verif_loginMdp = document.getElementsByClassName("verif_loginMdp");
                
            if(e.target.value.length > 8){
                verif_loginMdp[0].style.color = "green";
                this.mdp.verif_mdp.longueur = true;
            } else {
                verif_loginMdp[0].style.color = "red";
                this.mdp.verif_mdp.longueur = false;
            }

            var regSpecial = /[!@#$%^&*(),.?":{}|<>]/;
            if(regSpecial.test(e.target.value)){
                verif_loginMdp[1].style.color = "green";
                this.mdp.verif_mdp.special = true;
            } else {
                verif_loginMdp[1].style.color = "red";
                this.mdp.verif_mdp.special = false;
            }

            var regMaj = /.*[A-Z]/;
            if(regMaj.test(e.target.value)){
                verif_loginMdp[2].style.color = "green";
                this.mdp.verif_mdp.maj = true;
            } else {
                verif_loginMdp[2].style.color = "red";
                this.mdp.verif_mdp.maj = false;
            }
        }
    },
    template:`
    <div>
        <button type="button" class="btn btn-secondary"
        v-on:click="showReinitMdp()">
        Réinitialiser votre mot de passe</button>

        <div v-if="showReinit">
            <div class="my-2">
                <label>Ancien mot de passe :</label>
                <input type="text" placeholder="Veuillez retaper votre ancien mot de passe" 
                class="form-control px-2" v-model="mdp.mdp_bdd">
            </div>

            <div class="my-2">
                <label>Nouveau mot de passe :</label>
                <input type="text" placeholder="Veuillez taper votre nouveau mot de passe" 
                class="form-control px-2" @input="watch_mdp" v-model="mdp.nv_mdp">

                <ul class="list-group list-group-flush small">
                    <li class="list-group-item verif_loginMdp" style="color:red">
                    Au moins 8 caractères</li>
                    <li class="list-group-item verif_loginMdp" style="color:red">
                    Au moins 1 caractère spécial</li>
                    <li class="list-group-item verif_loginMdp" style="color:red">
                    Au moins 1 majuscule</li>
                </ul>
            </div>
        </div>
    </div> `
}



//Eléments racines

var formPrjt = {
    props:{
        _propIndex:{
            type: Number,
            required: true,
        },
        _propTitre:{
            type: String,
            required: true,
        },
        _propContenu:{
            type: String,
            required:true,
        },
        _propCat:{
            type: Object,
            required: true,
        },
        _propCle:{
            type: String,
            required: true,
        }
    },
    data: function(){
        return{
            index: this._propIndex,
            titre: this._propTitre,
            listeChps: JSON.parse(this._propContenu),
            cle: this._propCle,
            cat: this._propCat.id,
        }
    },
    components:{
        'txt_court':txt_court,
        'txt_long':txt_long,
        'liste_infos':liste_infos,
        'media': media,
        'upl_fchs':upl_fchs,
        'ajtChp':ajtChp,
    },
    computed:{
    },
    watch:{
        titre:function(){
            if(this.titre === ""){
                setTimeout(() => {
                    if(this.titre === ""){ this.titre = "Sans Titre";}
                }, 500);
            }
            this.$parent.listePrjts[this.index].titre = this.titre;
        },
        _propTitre:function(){
            this.titre = this._propTitre;
        },
        _propContenu:function(){
            this.listeChps = JSON.parse(this._propContenu);
        },
        _propCle:function(){
            this.cle = this._propCle;
        },
        _propIndex:function(){
            this.index = this._propIndex;
        },
    },
    methods:{
        isThumbnail: function(){
            this.savePrjt();
            this.$parent.isThumbnail(this.cat, this.cle);
        },
        modifContenu:function(input, index){
            this.listeChps[index].contenu = input;
            this.$parent.listePrjts[this.index].modif = true;
        },
        savePrjt:function(display){
            this.$parent.savePrjt(this.index, this.cat, this.titre, this.cle, JSON.stringify(this.listeChps), display);
        },
        addChp: function(nvChp){
            this.listeChps.push({'titre':nvChp.titre, 'type':nvChp.type, 'contenu':nvChp.contenu});
            this.savePrjt();
        }
    },
    template:`
    <div class="col py-3 mb-3 border-bottom">
        <div class="form-group pb-3">
            <label><strong>Titre :</strong></label>
            <input type="text" ref="prjt_titre" v-model="titre" class="form-control"/>
        </div>

        <div
        v-for="(item, index) in listeChps"
        :key="index"
        class="component_chp" >
            <component v-bind:is="item.type" 
            :prjt_titre="titre" 
            :prjt_cat="cat" 
            :prjt_cle="cle" 
            :chp_titre="item.titre" 
            :chp_contenu="item.contenu" 
            v-on:modif="modifContenu($event, index)"
            v-on:upload="savePrjt(false)"
            v-on:nvlleMiniat="isThumbnail()"></component>
        </div>

        <ajtChp v-on:addChp="addChp($event)"></ajtChp>

        <div class="form-group mt-3">
            <button type="button" class="btn btn-primary btn-lg" v-on:click="savePrjt(true)">Enregistrer les modifications</button>
        </div>
    </div> `
};

var formCats = {
    props:{
        _cat:{
            type:String,
            required:true
        },
        _id:{
            type:String,
            required:true
        },
        _index:{
            type: Number,
            required: true
        }
    },
    data:function(){
        return{
            cat: this._cat,
            num_cat: this._id,
            
            listeChps: this.recupModele(this._id),
            
            show_bool: false,
        }
    },
    components:{
        'ajtChp': ajtChp,
        'typeChp': typeChp,
    },
    watch:{
        cat: function(){
            if(this.cat === ""){
                setTimeout(() => {
                    if(this.cat === ""){ this.cat = "Sans Titre";}
                }, 500);
            }
        },
        _cat: function(){
            this.cat = this._cat;
        },
        _id: function(){
            this.listeChps = this.recupModele(this._id);
            this.num_cat = this._id;
        },
    },
    methods:{
        recupModele(index){
            if(index !== ""){
                ajaxPost("_php/recup_prjts.php", "cat="+index, (retour) => {
                    if(retour){
                        var liste_retour = JSON.parse(retour);
                        this.listeChps = JSON.parse(liste_retour[0].contenu_json);
                    }
                }, false);
            }
        },
        showCat:function(){
            if(!this.show_bool){
                this.show_bool = true;
            } else {
                this.show_bool = false;
            }    
        },
        saveCat: function(){
            let formData = new FormData();
            formData.set('cat', this.cat);
            formData.set('id', this.num_cat);
            formData.set('modele', JSON.stringify(this.listeChps));
            ajaxPost('_php/save_cat.php', formData, (retour) => {
                console.log(retour);
                if(retour === "modifs ok"){
                    this.$parent.$emit('emitRefresh', 'cats');
                    alert('Les modifications ont été enregistrées !');
                } else if(retour === "session_prblm"){
                    alert('Votre session a expirée, veuillez vous reconnecter');
                    document.location.reload(true);
                }
            }, true);
        },
        supprCat:function(index){
            if(confirm("Êtes-vous sûr.e de vouloir supprimer cette catégorie?\nToutes les pages et leurs fichiers associés seront supprimés également.")){
                let formData = new FormData();
                formData.set('cat', 'cat_'+this.cat);
                formData.set('id', this.num_cat);
                ajaxPost('_php/suppr_cat.php', formData, (retour) =>  {
                    console.log(retour);
                    if(retour !== "session_prblm"){
                        alert("Catégorie supprimée !");
                        this.$emit('suppr', index);
                    } else {
                        alert('Votre session a expirée, veuillez vous reconnecter');
                        document.location.reload(true);
                    }
                }, true);
            }
        },
        addChp: function(nvChp){
            this.listeChps.push({'titre':nvChp.titre, 'type':nvChp.type, 'contenu':nvChp.contenu});
            this.saveCat();
        },
        supprChp: function(index){
            this.listeChps.splice(index,1);
        }
    },
    template:`
    <div class="my-2">
        <div class="row no-gutters pb-2 align-items-center border-bottom">
            <div class="col align-items-center">
                <button type="button" class="btn btn-lg" v-on:click="showCat()">{{cat}}</button>
            </div>
            <button type="button" class="btn btn-danger" v-on:click="supprCat(_index)">X</button>
        </div>

        <div v-if="show_bool" class="form-group px-2">
            <label>Titre de la catégorie: </label><input type="text" v-model="cat" class="form-control mb-3">
            <div v-for="(item,index) in listeChps"
            :key="index" class="form-group row no-gutters align-items-center">
                <span class="col-lg-0">{{index + 1}} - </span><input type="text" v-model="item.titre" class="form-control col mr-2 px-2">
                <typeChp v-bind:_typeDefaut="item.type" class="form-control col mr-2 px-2"></typeChp>
                <button type="button" class="btn btn-danger" v-on:click="supprChp(index)">X</button>
            </div>
            <ajtChp v-on:addChp="addChp($event)"></ajtChp>
            <button type="button" class="btn btn-primary" v-on:click="saveCat()">Enregistrer la catégorie</button>
        </div>

    </div> `
};
