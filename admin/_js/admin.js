//Onglets de la page admin

var onglet_prjts = {
    props:{
        _refresh:{
            type:String,
        }
    },
    data: function(){
        return{
            //La liste des catégories
            listeCats: this.recupCats(),
            catActuelle: {},
            
            //la liste des projets
            listePrjts: '',
            
            //Bool pour cacher ce qu'il faut
            prjtsDisplay: false,
            refreshCats : this._refresh,
            showForm_bool:[],
            modif_bool:false,
        }
    },
    components:{
        'catSelector': catSelector,
        'formPrjt':formPrjt,
    },
    watch:{
        _refresh:function(){
            if(this._refresh === 'cats'){
                this.recupCats();
                this.$parent.refresh = '';
            }
        }
    },
    methods:{
        recupCats: function(){
            ajaxPost("_php/recup_cats.php","cat=liste_cats", (retour) => {
                this.listeCats = '';
                if(retour !== "[]"){
                    this.listeCats = JSON.parse(retour);
                } else {
                    this.listeCats = JSON.parse(retour);
                    this.prjtsDisplay = false;
                }
            }, false);
        },
        generateCle: function(){
            var S4 = function() {
               return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            };
            return (S4()+S4()+"-"+S4());
        },
        recupPrjts: function(index){
            this.listePrjts='';
            
            ajaxPost("_php/recup_prjts.php", "cat="+index, (retour) => {
                var liste_retour = JSON.parse(retour);

                this.listePrjts_modele = liste_retour.splice(-1,1); //Le modèle
                
                for(var i = 0; i < liste_retour.length; i++){
                    liste_retour[i].show = false;
                    liste_retour[i].modif = false;
                }
                
                this.listePrjts = liste_retour;
            }, false);
        },
        changeCat: function(index){
            if(index !== "none"){
                this.prjtsDisplay = true;

                this.catActuelle = this.listeCats[index];

                this.recupPrjts(this.catActuelle.id);
            } else {
                this.prjtsDisplay = false;
            }
        },
        nvPrjt:function(){
            var nvelleCle = this.generateCle();
            var nvTitre = 'Nouveau Projet';
            var nvContenu = this.listePrjts_modele[0].contenu_json;

            this.listePrjts.push({
                'prjt_cle': nvelleCle,
                'titre': nvTitre,
                'contenu_json': nvContenu,
                'show': true,
                'modif': false,
            });
            
            this.savePrjt(0, this.catActuelle.id, nvTitre, nvelleCle, nvContenu, false);
            
            this.$nextTick(function(){
                document.getElementById("prjt_"+nvelleCle).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
            });
        },
        savePrjt: function(index, cat, titre, cle, contenu, display){
            var formData = new FormData();
            formData.set('prjt_cat', 'cat_'+cat);
            formData.set('prjt_titre', titre);
            formData.set('prjt_cle', cle);
            formData.set('prjt_contenu', contenu);

            ajaxPost("_php/save_prjt.php", formData, (retour) => {
                console.log(retour);
                if(retour !== "session_prblm"){
                    this.listePrjts[index].modif = false;
                    if(display){
                        alert('Modifications enregistrées !');
                    }
                } else {
                    alert('Votre session a expirée, veuillez vous reconnecter');
                    document.location.reload(true);
                }
            }, true);
        },
        supprPrjt:function(index){
            if(confirm("Êtes-vous sûr.e de vouloir supprimer cette page?\nTous les fichiers associés seront supprimés également.")){
                let formData = new FormData();
                formData.set('prjt_cle', this.listePrjts[index].prjt_cle);
                formData.set('prjt_cat', 'cat_'+this.catActuelle.id);
                ajaxPost("_php/suppr_prjt.php", formData, (retour) => {
                    console.log(retour);
                    alert("Projet supprimé !");
                    this.listePrjts.splice(index,1);
                }, true);
            }
        },
        showForm: function(index, cle){
            if(this.listePrjts[index].show){ 
                this.listePrjts[index].show = false; 
                console.log(this.listePrjts[index].show);
                this.$nextTick(function(){
                    document.getElementById("prjt_"+cle).scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
                });
            } else { 
                this.listePrjts[index].show = true;
                console.log(this.listePrjts[index].show);
                this.$nextTick(function(){
                    document.getElementById("prjt_"+cle).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
                });
            }
        },
        isThumbnail:function(cat, cle){
            let formData = new FormData();
            formData.set('cat', cat);
            formData.set('cle', cle);
            ajaxPost("_php/isThumbnail.php", formData, (retour) => {
                if(retour !== "non"){
                    document.getElementById("thumbnail_"+cle).innerHTML ='';
                    var thumb = document.createElement("img");
                    thumb.src = retour.substring(3) + '?' + new Date().getTime();
                    thumb.classList.add("img-fluid");
                    thumb.classList.add("img-thumbnail");
                    thumb.style.maxHeight = "5em";
                    document.getElementById("thumbnail_"+cle).appendChild(thumb);
                } else {
                    document.getElementById("thumbnail_"+cle).innerHTML ='';
                }
            }, true);
        }
    },
    template:`
    <div>
        <h2>Ajouter ou modifier une page</h2>
        <div class="mb-3 mt-2">
            <catSelector 
            v-bind:listeCats="listeCats"   
            v-on:changeCat="changeCat($event)">
            </catSelector>
        </div>

        <div v-if="prjtsDisplay">
            <div class="row no-gutters mb-3 align-items-center">
                <h3 class="col">{{catActuelle.cat}} :</h3>

                <button type="button" class="btn btn-primary" v-on:click="nvPrjt()">Créer une nouvelle page</button>
            </div>

            <div v-if="listePrjts" 
            v-for="(prjt,index) in listePrjts" 
            :key="index" :id="'prjt_'+prjt.prjt_cle"
            class="align-items-center pb-2">

                <div class="row no-gutters border-bottom align-items-center pb-2">
                    <div class="col">
                        <button type="button" class="btn btn-lg" v-on:click="showForm(index, prjt.prjt_cle)">{{prjt.titre}}</button>
                        <span v-show="listePrjts[index].modif"><strong>*</strong></span>
                    </div>

                    <div :id="'thumbnail_'+prjt.prjt_cle" class="col-sm-2 mx-5">
                        <span v-if="isThumbnail(catActuelle.id, prjt.prjt_cle)"></span>
                    </div>

                    <button type="button" class="btn btn-danger" v-on:click="supprPrjt(index)">X</button>
                </div>
                
                <keep-alive>
                    <formPrjt v-if="prjt.show"
                    v-bind:_propTitre="prjt.titre" 
                    v-bind:_propContenu="prjt.contenu_json" 
                    v-bind:_propCle="prjt.prjt_cle" 
                    v-bind:_propCat="catActuelle"
                    v-bind:_propIndex="index"></formPrjt>
                </keep-alive>
            
            </div>
        </div>
    </div> `
};

var onglet_cats = {
    data: function(){
        return{
            listeCats: this.recupCats(),
            modeleCat: [
                {'titre':'Support', 'type':'txt_court', 'contenu': ''},
                {'titre':'Commentaire', 'type':'txt_long', 'contenu': ''},
                {'titre':'Infos Techniques', 'type':'liste_infos', 'contenu': []},
                {'titre':'Médias Externes', 'type':'media', 'contenu': []},
                {'titre':'Images & documents', 'type':'upl_fchs', 'contenu': []}
            ],
        }
    },
    components:{
        'formCats': formCats,
    },
    methods:{
        recupCats: function(){
            ajaxPost("_php/recup_cats.php","cat=liste_cats", (retour) => {
                this.listeCats = JSON.parse(retour);
            }, false);
        },
        nvlleCat: function(){
            let formData = new FormData();
            formData.set('cat', 'Nouvelle Catégorie');
            formData.set('id','0');
            formData.set('modele', JSON.stringify(this.modeleCat));
            ajaxPost("_php/save_cat.php", formData, (retour) => {
                console.log(retour);
                this.listeCats.push({
                    'id':retour,
                    'cat':'Nouvelle Catégorie'});
                this.$emit('emitRefresh', 'cats');
                
                this.$nextTick(function(){
                    document.getElementById("listeCats").lastChild.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
                });
            }, true);
        },
        supprCats: function(index){
            this.listeCats.splice(index,1);
            this.$emit('emitRefresh', 'cats');
        }
    },
    template:`
    <div>
        <h2>Ajouter ou modifier une catégorie</h2>

        <div class="row no-gutters mb-3 mt-2 align-items-center">
            <h3 class="col">Vos Catégories :</h3>

            <button type="button" class="btn btn-primary mt-2" v-on:click="nvlleCat()">
            Créer une nouvelle catégorie</button>
        </div>
        
        <div id="listeCats">
            <formCats v-for="(item,index) in listeCats"
            :key="index"
            v-bind:_cat="item.cat"
            v-bind:_id="item.id"
            v-bind:_index="index"
            v-on:suppr="supprCats($event)">
            </formCats>
        </div>
    </div> `
};

var onglet_infos = {
    data: function(){
        return{
            modeleAccueil: [
                {'titre':'Texte d\'accueil', 'type': 'txt_long', 'contenu':'Bonjour, bienvenue sur mon site propulsé avec **Yapo !**'},
                {'titre':'Médias Externes', 'type': 'media', 'contenu':[]},
                {'titre':'Images', 'type': 'upl_fchs', 'contenu':[]},
            ],
            listeChps:this.recupAccueil(),
        }
    },
    components:{
        'txt_long':txt_long,
        'media':media,
        'upl_fchs':upl_fchs,
    },
    methods:{
        recupAccueil:function(){
            ajaxPost("_php/recup_cats.php", "cat=accueil", (retour) => {
                if(retour !== "[]"){
                    var contenu_retour = JSON.parse(retour);
                    this.listeChps = JSON.parse(contenu_retour[0].contenu_json);
                } else {
                    this.listeChps = this.modeleAccueil;
                }

            }, false);
        },
        modifContenu:function(input, index){
            this.listeChps[index].contenu = input;
        },
        saveAccueil:function(display){
            var formData = new FormData();
            formData.set('prjt_cat', 'accueil');
            formData.set('prjt_titre', 'accueil');
            formData.set('prjt_cle', 'accueil');
            formData.set('prjt_contenu', JSON.stringify(this.listeChps));

            ajaxPost("_php/save_prjt.php", formData, (retour) => {
                console.log(retour);
                if(retour !== "session_prblm"){
                    if(display){
                       alert('Modifications enregistrées !'); 
                    }
                } else {
                    alert('Votre session a expirée, veuillez vous reconnecter');
                    document.location.reload(true);
                }
            }, true);
        },
    },
    template:`
    <div>
        <h2>Modifier votre page d'accueil</h2>

        <div>
            <div v-for="(item,index) in listeChps"
            :key="index">
                <component v-bind:is="item.type"
                v-bind:chp_titre="item.titre"
                v-bind:chp_contenu="item.contenu"
                v-bind:prjt_titre="'accueil'"
                v-bind:prjt_cat="'accueil'"
                v-bind:prjt_cle="'accueil'"
                v-on:modif="modifContenu($event, index)"
                v-on:upload="saveAccueil(false)">
                </component>
            </div>
            <button type="button" class="btn btn-primary" v-on:click="saveAccueil(true)">Enregistrer les modifications</button>
        </div>
    </div> `
};

var onglet_actus = {
    props:{
        _refresh:{
            type:String,
        }
    },
    data: function(){
        return{
            //La liste des catégories
            catActus:{
                'id':'actu',
                'cat':'actu',
            },
            
            //la liste des projets
            listePrjts: this.recupPrjts(),
            modeleActus: [
                {'titre':'Commentaire', 'type':'txt_long', 'contenu': ''},
                {'titre':'Médias Externes', 'type':'media', 'contenu': []},
                {'titre':'Images', 'type':'upl_fchs', 'contenu': []}
            ],
            
            //Bool pour cacher ce qu'il faut
            prjtsDisplay: true,
            refreshCats : this._refresh,
            showForm_bool:[],
            modif_bool:false,
        }
    },
    components:{
        'formPrjt':formPrjt,
    },
    watch:{
        _refresh:function(){
            if(this._refresh === 'cats'){
                this.recupCats();
                this.$parent.refresh = '';
            }
        }
    },
    methods:{
        generateCle: function(){
            var S4 = function() {
               return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            };
            return (S4()+S4()+"-"+S4());
        },
        recupPrjts: function(index){
            this.listePrjts='';
            
            ajaxPost("_php/recup_prjts.php", "cat=actu", (retour) => {
                if(retour){
                    var liste_retour = JSON.parse(retour);
                
                    for(var i = 0; i < liste_retour.length; i++){
                        liste_retour[i].show = false;
                        liste_retour[i].modif = false;
                    }

                    this.listePrjts = liste_retour;
                } else {
                    this.listePrjts = [];
                }
            }, false);
        },
        nvPrjt:function(){
            var nvelleCle = this.generateCle();
            var nvTitre = 'Nouvelle Actualité';
            var nvContenu = JSON.stringify(this.modeleActus);

            this.listePrjts.push({
                'prjt_cle': nvelleCle,
                'titre': nvTitre,
                'contenu_json': nvContenu,
                'show': true,
                'modif': false,
            });
            
            this.savePrjt(0, 'actu', nvTitre, nvelleCle, nvContenu);
            
            this.$nextTick(function(){
                document.getElementById("prjt_"+nvelleCle).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
            });
        },
        savePrjt: function(index, cat, titre, cle, contenu, display){
            var formData = new FormData();
            formData.set('prjt_cat', 'cat_'+cat);
            formData.set('prjt_titre', titre);
            formData.set('prjt_cle', cle);
            formData.set('prjt_contenu', contenu);

            ajaxPost("_php/save_prjt.php", formData, (retour) => {
                console.log(retour);
                if(retour !== "session_prblm"){
                    this.listePrjts[index].modif = false;
                    if(display){
                        alert('Modifications enregistrées !');
                    }
                } else {
                    alert('Votre session a expirée, veuillez vous reconnecter');
                    document.location.reload(true);
                }
            }, true);
        },
        supprPrjt:function(index){
            if(confirm("Êtes-vous sûr.e de vouloir supprimer cette page?\nTous les fichiers associés seront supprimés également.")){
                let formData = new FormData();
                formData.set('prjt_cle', this.listePrjts[index].prjt_cle);
                formData.set('prjt_cat', 'cat_actu');
                ajaxPost("_php/suppr_prjt.php", formData, (retour) => {
                    console.log(retour);
                    alert("Projet supprimé !");
                    this.listePrjts.splice(index,1);
                }, true);
            }
        },
        showForm: function(index){
            if(this.listePrjts[index].show){ 
                this.listePrjts[index].show = false; 
                console.log(this.listePrjts[index].show);
            } else { 
                this.listePrjts[index].show = true;
                console.log(this.listePrjts[index].show);
            }
        },
        isThumbnail:function(cat, cle){
            let formData = new FormData();
            formData.set('cat', cat);
            formData.set('cle', cle);
            ajaxPost("_php/isThumbnail.php", formData, (retour) => {
                if(retour !== "non"){
                    document.getElementById("thumbnail_"+cle).innerHTML ='';
                    var thumb = document.createElement("img");
                    thumb.src = retour.substring(3) + '?' + new Date().getTime();
                    thumb.classList.add("img-fluid");
                    thumb.classList.add("img-thumbnail");
                    thumb.style.maxHeight = "5em";
                    document.getElementById("thumbnail_"+cle).appendChild(thumb);
                } else {
                    document.getElementById("thumbnail_"+cle).innerHTML ='';
                }
            }, true);
        }
    },
    template:`
    <div>
        <h2>Ajouter ou modifier une actualité</h2>

        <div v-if="prjtsDisplay">
            <div class="row no-gutters mb-3 mt-2 align-items-center">
                <h3 class="col">Vos actualités :</h3>

                <button type="button" class="btn btn-primary" v-on:click="nvPrjt()">Créer une nouvelle actualité</button>
            </div>

            <div v-if="listePrjts" 
            v-for="(prjt,index) in listePrjts" 
            :key="index" :id="'prjt_'+prjt.prjt_cle"
            class="align-items-center pb-2">

                <div class="row no-gutters border-bottom align-items-center pb-2">
                    <div class="col">
                        <button type="button" class="btn btn-lg" v-on:click="showForm(index)">{{prjt.titre}}</button>
                        <span v-show="listePrjts[index].modif"><strong>*</strong></span>
                    </div>

                    <div :id="'thumbnail_'+prjt.prjt_cle" class="col-sm-2 mx-5">
                        <span v-if="isThumbnail('actu', prjt.prjt_cle)"></span>
                    </div>

                    <button type="button" class="btn btn-danger" v-on:click="supprPrjt(index)">X</button>
                </div>
                
                <keep-alive>
                    <formPrjt v-if="prjt.show"
                    v-bind:_propTitre="prjt.titre" 
                    v-bind:_propContenu="prjt.contenu_json" 
                    v-bind:_propCle="prjt.prjt_cle" 
                    v-bind:_propCat="catActus"
                    v-bind:_propIndex="index"></formPrjt>
                </keep-alive>
            
            </div>
        </div>
    </div> `
};

var a_propos = {
    data: function(){
        return{
            modeleApropos: [
                {'titre':'Texte d\'accueil', 'type': 'txt_long', 'contenu':'Dites quelque chose à propos de **vous**'},
                {'titre':'Médias Externes', 'type': 'media', 'contenu':[]},
                {'titre':'Liste d\'infos', 'type': 'liste_infos', 'contenu':[]},
                {'titre':'Images & documents', 'type': 'upl_fchs', 'contenu':[]},
            ],
            listeChps:this.recupApropos(),
        }
    },
    components:{
        'txt_long':txt_long,
        'media':media,
        'liste_infos':liste_infos,
        'upl_fchs':upl_fchs,
    },
    methods:{
        recupApropos:function(){
            ajaxPost("_php/recup_cats.php", "cat=apropos", (retour) => {
                if(retour !== "[]"){
                    var contenu_retour = JSON.parse(retour);
                    this.listeChps = JSON.parse(contenu_retour[0].contenu_json);
                } else {
                    this.listeChps = this.modeleApropos;
                }
            }, false);
        },
        modifContenu:function(input, index){
            this.listeChps[index].contenu = input;
        },
        saveAccueil:function(display){
            var formData = new FormData();
            formData.set('prjt_cat', 'apropos');
            formData.set('prjt_titre', 'apropos');
            formData.set('prjt_cle', 'apropos');
            formData.set('prjt_contenu', JSON.stringify(this.listeChps));

            ajaxPost("_php/save_prjt.php", formData, (retour) => {
                if(retour !== "session_prblm"){
                    if(display){
                       alert('Modifications enregistrées !'); 
                    }
                } else {
                    alert('Votre session a expirée, veuillez vous reconnecter');
                    document.location.reload(true);
                }
            }, true);
        },
    },
    template:`
    <div>
        <h2>Modifier votre page à propos</h2>

        <div>
            <div v-for="(item,index) in listeChps"
            :key="index">
                <component v-bind:is="item.type"
                v-bind:chp_titre="item.titre"
                v-bind:chp_contenu="item.contenu"
                v-bind:prjt_titre="'apropos'"
                v-bind:prjt_cat="'apropos'"
                v-bind:prjt_cle="'apropos'"
                v-on:modif="modifContenu($event, index)"
                v-on:upload="saveAccueil(false)">
                </component>
            </div>
            <button type="button" class="btn btn-primary" v-on:click="saveAccueil(true)">Enregistrer les modifications</button>
        </div>
    </div> `
};

var onglet_params = {
    data: function(){
        return{
            modeleParams: [
                {'titre':'Mon site avec Yapo',
                'header_img':[],
                'site_root':'http://collectif8h30.fr',
                'tags_meta': [],
                },
            ],
            listeChps:this.recupParams(),
        }
    },
    components:{
        'upl_enTete':upl_enTete,
        'liste_reseaux':liste_reseaux,
    },
    methods:{
        recupParams:function(){
            ajaxPost("_php/recup_cats.php", "cat=params", (retour) => {
                if(retour !== "[]"){
                    this.listeChps = JSON.parse(retour);
                    if(this.listeChps[0].header_img !== ""){
                        this.listeChps[0].header_img = JSON.parse(this.listeChps[0].header_img);
                    } else {
                        this.listeChps[0].header_img = [];
                    }
                    if(this.listeChps[0].tags_meta !== ""){
                        this.listeChps[0].tags_meta = JSON.parse(this.listeChps[0].tags_meta);
                    } else {
                        this.listeChps[0].tags_meta = [];
                    }
                } else {
                    this.listeChps = this.modeleParams;
                }
            }, false);
        },
        saveParams:function(header_img, display){
            var formData = new FormData();
            formData.set('cle','params');
            formData.set('titre', this.listeChps[0].titre);
            
            if(header_img){
                formData.set('header_img', JSON.stringify(header_img));
            }
        
            formData.set('site_root', this.listeChps[0].site_root);
            formData.set('tags_meta', JSON.stringify(this.listeChps[0].tags_meta));

            ajaxPost("_php/save_params.php", formData, (retour) => {
                console.log(retour);
                if(retour !== "session_prblm"){
                    if(display){
                       alert('Modifications enregistrées !'); 
                    }
                } else {
                    alert('Votre session a expirée, veuillez vous reconnecter');
                    document.location.reload(true);
                }
            }, true);
        },
    },
    template:`
    <div>
        <h2>Modifier les coordonnées de votre site</h2>

        <div class="form-group my-2"
        v-for="(item,index) in listeChps"
        :key="index">
            <div class="pb-3 mb-3">
                <label>Titre de votre site : </label>
                <input type="text" v-model="item.titre" class="form-control">
            </div>
    
            <div class="form-group pb-3">
                <upl_enTete 
                :chp_contenu="item.header_img" 
                v-on:upload="saveParams($event, false)"></upl_enTete>
            </div>
    
            <div class="pb-3 mb-3">
                <label>Adresse URL de votre site : </label>
                <input type="text" v-model="item.site_root" class="form-control">
            </div>

            <div class="form-group pb-3">
                <liste_reseaux 
                :chp_titre="'Balises meta :'" 
                :chp_contenu="item.tags_meta"
                :ex_name="'Description'"
                :ex_content="'Mon portfolio, retrouvez y mon travail!'"></liste_reseaux>
            </div>

            <div class="border-top pt-3">
                <button type="button" class="btn btn-primary" v-on:click="saveParams(false, true)">Enregistrer les modifications</button>
            </div>
        </div>
    </div> `
};

var onglet_contact = {
    data: function(){
        return{
            modeleContacts: [
                {'adresse':'',
                'mail':'',
                'reseaux':[]},
            ],
            listeChps:this.recupContacts(),
        }
    },
    components:{
        'liste_reseaux':liste_reseaux,
    },
    methods:{
        recupContacts:function(){
            ajaxPost("_php/recup_cats.php", "cat=contact", (retour) => {
                if(retour !== "[]"){
                    this.listeChps = JSON.parse(retour);
                    
                    if(this.listeChps[0].reseaux !== ""){
                        this.listeChps[0].reseaux = JSON.parse(this.listeChps[0].reseaux);
                    } else {
                        this.listeChps[0].reseaux = [];
                    }
                } else {
                    this.listeChps = this.modeleContacts;
                }

            }, false);
        },
        saveContacts:function(){
            console.log(this.listeChps);
            var formData = new FormData();
            formData.set('cle','contacts');
            formData.set('adresse', this.listeChps[0].adresse);
            formData.set('mail', this.listeChps[0].mail);
            formData.set('reseaux', JSON.stringify(this.listeChps[0].reseaux));

            ajaxPost("_php/save_contacts.php", formData, (retour) => {
                console.log(retour);
                if(retour !== "session_prblm"){
                   alert('Modifications enregistrées !'); 
                } else {
                    alert('Votre session a expirée, veuillez vous reconnecter');
                    document.location.reload(true);
                }
            }, true);
        },
    },
    template:`
    <div>
        <h2>Modifier vos informations de contact</h2>

        <div class="form-group my-2" 
        v-for="(item,index) in listeChps"
        :key="index">
            <div class="pb-3 mb-3">
                <label>Votre adresse : </label>
                <input type="text" v-model="item.adresse" class="form-control">
            </div>
            
            <div class="pb-3 mb-3">
                <label>Votre mail : </label>
                <input type="text" v-model="item.mail" class="form-control">
            </div>

            <div class="form-group pb-3">
                <liste_reseaux 
                :chp_titre="'Vos réseaux : '"
                :chp_contenu="item.reseaux"
                :ex_name="'Par ex: Instagram'"
                :ex_content="'Votre instagram'"></liste_reseaux>
            </div>

            <div class="border-top pt-3">
                <button type="button" class="btn btn-primary" v-on:click="saveContacts()">Enregistrer les modifications</button>
            </div>
        </div>
    </div> `
};

var onglet_admin = {
    data: function(){
        return{
            modeleAdmin: [
                {
                    'admin_id':'',
                    'admin_mdp':'',
                }
            ],
            listeChps:this.recupContacts(),
        }
    },
    components:{
        'reinitMdp':reinitMdp,
    },
    methods:{
        recupContacts:function(){
            ajaxPost("_php/recup_cats.php", "cat=sys_admin", (retour) => {
                if(retour !== "[]"){
                    this.listeChps = JSON.parse(retour);
                    this.listeChps[0].admin_mdp = {
                        'mdp_bdd':'',
                        'nv_mdp':'',
                        'verif_mdp': {
                            'longueur':false,
                            'special':false,
                            'maj': false,
                        },
                    };   
                } else {
                    this.listeChps = this.modeleAdmin;
                    console.log(this.listeChps);
                }
            }, false);
        },
        saveAdmin:function(){
            console.log(this.listeChps);
            if(this.listeChps[0].admin_mdp.nv_mdp !== ""){
                if(this.listeChps[0].admin_mdp.verif_mdp.longueur === false || this.listeChps[0].admin_mdp.verif_mdp.special === false || this.listeChps[0].admin_mdp.verif_mdp.maj === false){
                        alert('Votre nouveau mot de passe ne respecte pas les demandes de sécurité !\nLe changement de mot de passe ne sera pas pris en compte.');

                        var formData = new FormData();
                        formData.set('cle','sys_admin');
                        formData.set('admin_id',this.listeChps[0].admin_id);
                        formData.set('old_mdp','');
                        formData.set('nv_mdp','');

                        ajaxPost("_php/save_admin.php", formData, (retour) => {
                            console.log(retour);
                            if(retour !== "session_prblm"){
                                if(retour === "old_mdp mauvais"){
                                    alert("L'ancien mot de passe entré n'est pas valable !\nLe changement de mot de passe ne sera pas pris en compte.");
                                } else if(retour === "no sys_admin"){
                                    alert('Il semble qu\'il y ait un problème avec la table sys_admin, ceci est une erreur fatale.\nContactez votre webmaster.');
                                } else {
                                    this.recupContacts();
                                    alert('Modifications enregistrées !'); 
                                }
                            } else {
                                alert('Votre session a expirée, veuillez vous reconnecter');
                                document.location.reload(true);
                            }
                        }, true);
                } else {
                    var formData = new FormData();
                    formData.set('cle','sys_admin');
                    formData.set('admin_id',this.listeChps[0].admin_id);
                    formData.set('old_mdp',this.listeChps[0].admin_mdp.mdp_bdd);
                    formData.set('nv_mdp',this.listeChps[0].admin_mdp.nv_mdp);

                    ajaxPost("_php/save_admin.php", formData, (retour) => {
                            console.log(retour);
                            if(retour !== "session_prblm"){
                                if(retour === "old_mdp mauvais"){
                                    alert("L'ancien mot de passe entré n'est pas valable !\nLe changement de mot de passe ne sera pas pris en compte.");
                                } else if(retour === "no sys_admin"){
                                    alert('Il semble qu\'il y ait un problème avec la table sys_admin, ceci est une erreur fatale.\nContactez votre webmaster.');
                                } else {
                                    
                                    this.recupContacts();
                                    alert('Modifications enregistrées !'); 
                                }
                            } else {
                                alert('Votre session a expirée, veuillez vous reconnecter');
                                document.location.reload(true);
                            }
                        }, true);
                }   
            } else {
                var formData = new FormData();
                formData.set('cle','sys_admin');
                formData.set('admin_id',this.listeChps[0].admin_id);
                formData.set('old_mdp','');
                formData.set('nv_mdp','');

                ajaxPost("_php/save_admin.php", formData, (retour) => {
                            console.log(retour);
                            if(retour !== "session_prblm"){
                                if(retour === "old_mdp mauvais"){
                                    alert("L'ancien mot de passe entré n'est pas valable !\nLe changement de mot de passe ne sera pas pris en compte.");
                                } else if(retour === "no sys_admin"){
                                    alert('Il semble qu\'il y ait un problème avec la table sys_admin, ceci est une erreur fatale.\nContactez votre webmaster.');
                                } else {
                                    this.recupContacts();
                                    alert('Modifications enregistrées !'); 
                                }
                            } else {
                                alert('Votre session a expirée, veuillez vous reconnecter');
                                document.location.reload(true);
                            }
                        }, true);
            }
        },
    },
    template:`
    <div>
        <h2>Modifier vos informations administrateurs</h2>

        <div class="form-group my-2"
        v-for="(item,index) in listeChps"
        :key="index">
            <div class="mt-3">

                <div class="mb-3 pb-3">
                    <div class="mt-3">
                        <label>Votre login : </label>
                        <input type="text" v-model="item.admin_id" class="form-control">
                    </div>

                    <div class="mt-3">
                        <reinitMdp v-bind:_mdp="item.admin_mdp"></reinitMdp>
                    </div>
                </div>
            </div>

            <div class="border-top pt-3">
                <button type="button" class="btn btn-primary" v-on:click="saveAdmin()">Enregistrer les modifications</button>
            </div>
        </div>
    </div> `
};

var accueilProjet = {
    data: function(){
        return{
            
        }
    },
    methods:{
        changeOnglet:function(value){
            this.$parent.chgOngletActuel(value);
        },
        switchVisi:function(index){
            if(document.getElementById("explics_"+index).style.display === "none"){
                document.getElementById("explics_"+index).style.display = "block";
            } else {
                document.getElementById("explics_"+index).style.display = "none";
            }
        }
    },
    template:`
    <div>
        <h2>Contenu</h2>

        <p>
            Vous êtes arrivé dans l'espace qui vous sert à créer, modifier ou supprimer le contenu de votre site. <br>
            <br>
            <strong style="color: blue">Pour bien commencer :</strong>
        </p>

        <div class="border-bottom">
            <button type="button" class="btn btn-lg" v-on:click="switchVisi(0)">Une rapide introduction</button>

            <div id="explics_0" class="mb-sm-3" style="display:none">
                <p class="mb-2 pb-2">
                    Yapo est là pour vous permettre de créer et gérer simplement et rapidement le contenu de votre site.<br> 
                    <br>
                    Ce contenu peut se diviser en cinq:<br>
                    <ul>
                        <li>Vos <strong>pages</strong> qui seront rangées dans des <strong>catégories</strong></li>
                        <li>Votre <strong>page d'accueil</strong></li>
                        <li>Vos <strong>actualités</strong></li>
                        <li>Votre <strong>à propos</strong></li>
                    </ul>
                    <br>
                    Vous remarquerez que chaque mot en gras correspond à un des panneaux du menu de gauche. C'est voulu et c'est fait pour que vous ne vous occupiez que de ce qui vous intéresse !<br> 
                    Nous vous conseillons tout de même, si c'est la première fois que vous vous gérez un site, ou si vous vous sentez perdu, de lire les explications détaillées pour chaque panneau ci-dessous. Sinon, vous pouvez vous jeter dans le bain et voir sous vos yeux ébahis votre site web se remplir et émerveiller vos amis.<br>
                    <br>
                    En cas de problème, pour une aide personnalisée, ou pour nous adresser un message de félicitations (nous sommes très sensibles à la flatterie), vous pouvez contacter le webmaster à l'adresse suivante:  <strong>yapo(at)collectif8h30.fr</strong>
                    <br>
                    Bonne découverte !
                </p>
            </div>
        </div>
        
        <div class="border-bottom">
            <button type="button" class="btn btn-lg" v-on:click="switchVisi(2)">Mes catégories</button>

            <div id="explics_2" class="mb-sm-3" style="display:none">
                <p>
                    Première étape dans la gestion de votre contenu: les catégories.<br>
                    <br>
                    Elles servent à <em>organiser votre site</em>, et donc comment vos visiteurs vont le parcourir.<br>
                    Vous pouvez en créer de nouvelles à tout moment. Elles peuvent s’appeler n’importe comment : vous pouvez créer des catégories <em>“Peintures”</em> et <em>“Dessins”</em> pour ranger votre site par pratique, <em>“2019”</em> et <em>“2018”</em> si vous souhaitez organiser vos projets chronologiquement, ou encore <em>“Choucroute Cosmique”</em> et <em>“Hypertrophie Existentielle”</em> si ce sont les noms de vos séries !<br>
                    <strong>Si vous ne souhaitez pas séparer vos projets dans différentes catégories, vous pouvez aussi en créer une générale appelée <em>“Travaux”</em>, ou <em>“Oeuvres”</em>, et tout y ranger.</strong>
                    <br>
                    <br>
                    Vos catégories sont personnalisables, vous décidez de leur nom, du type et de l'ordre des <strong>champs</strong> qui s'y trouve. <em>Kessadire?</em><br>
                    <br>
                    Voyons les choses comme ça : lorsque vous créez une page, Yapo vous pose des questions, et les réponses que vous leur apportez est le contenu que le visiteur verra sur votre site.<br>
                    Yapo vous propose par défaut une suite de questions correspondant à ce qu'on attend d'une page de portfolio d'artiste, mais vous pouvez à tout moment décider d'ajouter, de modifier ou d'enlever une question. Ces questions sont les fameux <em>champs.</em><br>
                    Personnaliser les champs de vos catégories revient donc à choisir quelles questions Yapo vous pose et dans quel ordre. Chaque champ à un nom et un type. Le nom est l'intitulé de la question, il n'est là que pour vous simplifier la vie et vous permettre de vous rappeler ce que vous voulez y dire, le type détermine quelle réponse vous pouvez donner.<br>
                    <br>
                    <strong>Voici une liste des types de champs possibles</strong>
                        <ul>
                            <li><strong>texte court : </strong>un texte... Court. Vous servira en général pour des titres, des dates, ou des mediums</li>
                            <li><strong>texte long : </strong>une zone de texte dans lequel vous pourrez écrire un commentaire, un résumé, etc. Ces champs sont compilés en markdown, C'est-à-dire que vous pouvez utiliser des raccourics pour mettre des mots en gras, en italique, insérer des liens ou des images, etc.</li>
                            <li><strong>liste d'infos : </strong>une succession de petites informations courtes, qui seront affichées comme une liste</li>
                            <li><strong>médias externes : </strong>un champ d'insertion de medias. Concrètement, cela veut dire que vous pouvez y intégrer une vidéo youtube, vimeo, dailymotion, un lecteur bandcamp ou soundcloud. Pour cela, vous devez utiliser la fonction partager/intégrer de ces plate-formes et copier-coller le lien. Seuls ces sites sont autorisés pour des raisons de sécurité. Si vous devez ajouter une autre plate-forme, contactez le webmaster à l'adresse yapo(at)collectif8h30.fr</li>
                            <li><strong>envoi de fichiers : </strong>vous permet d'ajouter des images et des documents pdf à votre site. Pour chaque image ajoutée, vous pouvez choisir de l'afficher ou non sur la page, de l'utiliser comme aperçu de cette page, ou la supprimer.</li>
                        </ul>
                    <br>
                    Vous pouvez à tout moment ajouter un nouveau champ, les modifications seront apportées au modèle par défaut de cette catégorie, et apparaitront lorsque vous créerez une nouvelle page dans cette catégorie.<br>
                    <br>
                    Deux choses à retenir pour finir:
                    <ul>
                        <li>Conservez toujours au moins une catégorie !<br>
                        Vous ne pouvez pas créer de nouvelles pages si elles ne sont pas associées à une catégorie.<br></li>
                        <li><strong>Attention: La suppression d’une catégorie entrainera la suppression de toutes les pages associées et leurs fichiers !</strong></li>
                    </ul>
                </p>
                <button type="button" class="btn btn-secondary" v-on:click="changeOnglet('onglet_cats')">Aller à vos catégories</button>
            </div>
        </div>

        <div class="border-bottom">
            <button type="button" class="btn btn-lg" v-on:click="switchVisi(1)">Mes pages</button>
            
            <div id="explics_1" class="mb-sm-3" style="display:none">
                <p>
                    Maintenant qu'au moins une catégorie est créée, vous pouvez créer des pages qui y seront rangées.<br>
                    <br>
                    Choisissez une catégorie dans la liste pour faire apparaître toutes les pages qui y sont associées déjà existantes. Un bouton "créer une nouvelle page" est à votre disposition pour... Eh bien, créer une nouvelle page, car nous croyons profondément aux appellations simples et claires.<br>
                    Lors de la création d'une nouvelle page, le modèle que vous avez défini (la liste des questions, leur nom et leur type) pour la catégorie est utilisé pour vous proposer un formulaire correspondant.<br>
                    Chaque champ a un comportement différent, mais tous sont pensés pour être les plus clairs et simples possibles. Le champ le plus complexe (parce qu'il propose le plus de fonctionnalités) est le texte long, et ses raccourcis markdown mystérieux. Pour des raisons de place et de clarté nous n'avons pu en inclure une liste exhaustive, mais <a href="https://docs.framasoft.org/fr/grav/markdown.html" target="_blank">ce site</a> les répertorie. N'hésitez pas à vous y plonger si vous souhaiter personnaliser vos textes.<br>
                    <br>
                    Les titres des pages sont modifiables à tout moment, mais elles doivent en avoir un. Par défaut, si vous décider de ne pas nommer vos pages, elles s'appelleront <em>Sans titre.</em> Leur contenu est également modifiable à tout moment, et vous pouvez rajouter des champs si vous en avez besoin spécifiquement pour chaque page.<br>
                    <br>
                    <strong>En revanche,</strong> vous ne pouvez pas modifier la catégorie dans laquelle une page est rangée une fois la page créée, vous devrez la supprimer et la recréer ailleurs.<br>
                    <br>
                    Chacunes de vos pages peut se voir attribuer une image qui servira d'aperçu. Pour cela, commencez par ajouter une image à la page via un champ d'envoi de fichiers, et utilisez l'option <em>Utliser l'image comme aperçu.</em> <strong>Attention : </strong>Si vous souhaitez ensuite supprimer l'image, utilisez d'abord l'option <em>Ne plus utiliser l'image comme aperçu.</em>
                    <br>
                    La création de pages est pensée pour être le plus simple possible, pour que vous puissiez passer du temps à penser votre contenu, plutôt que le moyen de le faire exister en ligne. En cas de problème, là encore, contactez le webmaster à l'adresse <strong>yapo(at)collectif8h30.fr</strong>
                </p>
                <button type="button" class="btn btn-secondary" v-on:click="changeOnglet('onglet_prjts')">Aller à vos pages</button>
            </div>
        </div>

        <div class="border-bottom">
            <button type="button" class="btn btn-lg" v-on:click="switchVisi(4)">Mon accueil</button>

            <div id="explics_4" class="mb-sm-3" style="display:none">
                <p>
                    Votre page d’accueil est votre première vitrine, ce que vos visiteurs verront à leur arrivée sur votre site.<br>
                    Vous pouvez y écrire du texte, y placer des images ou des medias externes, de la même manière que sur une de vos pages, à la différence que le nombre de champs est ici limité, pour des raisons d'ergonomie.<br>
                    <br>
                    N'hésitez pas à mettre souvent à jour cette page ! Cela montrera à vos visiteurs (et au robot google) que votre site est actif.
                </p>
                <button type="button" class="btn btn-secondary" v-on:click="changeOnglet('onglet_infos')">Aller à votre accueil</button>
            </div>
        </div>

        <div class="border-bottom">
            <button type="button" class="btn btn-lg" v-on:click="switchVisi(3)">Mes actualités</button>
            
            <div id="explics_3" class="mb-sm-3" style="display:none">
                <p>
                    La section actualité de votre site est optionnelle.<br>
                    Par défaut, elle n'apparaîtra pas à vos visiteurs, jusqu'à ce que vous ajoutiez au moins une actualité. Ensuite, elles s'afficheront toutes, par date de création de la plus récente à la plus ancienne, sur votre page <em>Actualités.</em><br>
                    <br>
                    <strong>Concrètement,</strong> cela signifique vous pouvez avoir une petite section blog sur votre site, ou chaque billet est comme une page, mais où tous seront affichés au même endroit.<br>
                    Le panneau <strong>Mes actualités</strong> fonctionne donc exactement comme le panneau <strong>Mes pages.</strong><br>
                    <br>
                    Nous ne pouvons que vous encourager à souvent créer des actualités, à utiliser cette fonctionnalité pour que véritablement tenir au courant votre public de vos futurs évènements, de vos travaux, etc. D'autant que dans le public de votre site web se trouve le robot google, et que le robot google aime que vous mettiez souvent à jour vos pages !
                </p>
                <button type="button" class="btn btn-secondary" v-on:click="changeOnglet('onglet_actus')">Aller à vos actualités</button>
            </div>
        </div>

        <div class="border-bottom">
            <button type="button" class="btn btn-lg" v-on:click="switchVisi(5)">À propos de moi</button>

            <div id="explics_5" class="mb-sm-3" style="display:none">
                <p>
                    La page À propos vous sert à vous présenter auprès des visiteurs, vous pouvez y afficher un texte expliquant votre démarche, y mettre des images et/ou des fichiers (comme un dossier d’artiste pdf).<br>
                    Comme pour le panneau <em>accueil,</em> ce panneau fonctionne comme une création de page, dont le nombre et le type de champs est fixé pour des raisons d'ergonomie.
                </p>
                <button type="button" class="btn btn-secondary" v-on:click="changeOnglet('a_propos')">Aller à votre à propos</button>
            </div>
        </div>
    </div> `
};

var accueilParams = {
    data: function(){
        return{
            
        }
    },
    methods:{
        changeOnglet:function(value){
            this.$emit('changeOnglet', value);
        },
        switchVisi:function(index){
            if(document.getElementById("explics_"+index).style.display === "none"){
                document.getElementById("explics_"+index).style.display = "block";
            } else {
                document.getElementById("explics_"+index).style.display = "none";
            }
        }
    },
    template:`
    <div>
        <h2>Paramètres</h2>

        <p>
        <em>Vous qui entrez ici...</em> N'ayez pas peur, ce n'est vraiment pas si compliqué !<br>
        <br>
        Toutes les informations et réglages des panneaux de la section paramètres ne devraient pas avoir besoin d'être modifiés souvent. Toutefois, si vous le souhaitez ou s'il le faut, vous pouvez y:
        <ul>
            <li>Modifier les informations de <strong>votre site</strong></li>
            <li>Modifier vos informations de <strong>contact</strong></li>
            <li>Modifier vos <strong>identifiants administrateurs</strong></li>
        </ul>
        </p>
        
        <div class="border-bottom">
            <button type="button" class="btn btn-lg" v-on:click="switchVisi(1)">Mon site</button>
            
            <div id="explics_1" class="mb-sm-3" style="display:none">
                <p>
                    C'est ici que vous pouvez modifier les informations de base de votre site, ainsi que ces étranges, mystérieuses et très utilses choses nommées les balises meta.<br>
                    <br>
                    <ul>
                        <li><strong>Mais d'abord,</strong> le titre de votre site : c'est tout simplement ce qui est affiché en haut du menu de votre site pour un visiteur, ainsi que dans son onglet de navigateur. C'est aussi un élément central dans le référencement de votre site sur google, pour faire en sorte que votre public vous trouve.<br>
                        Vous pouvez nommer votre site comme vous le voulez, mais nous vous conseillons de choisir un titre relativement court pour des raisons d'ergonomie et de lisibilité.<br>
                        <br>
                        Si vous souhaitez plutôt utiliser une image en tête de votre menu, c'est également ici que vous pourrez la choisir. Contrairement aux champs d'envoi de fichier des autres panneaux, celui-là ne vous permet d'envoyer qu'une image à la fois.<br>
                        <br></li>
                        
                        <li><strong>L'URL de votre site</strong> est son <em>adresse internet.</em> Par exemple : http://collectif8h30.fr est l'adresse URL du site du collectif 8h30, un formidable collectif nantais.<br>
                        Pour des raisons purement pratiques, il vous est possible de la modifier, <strong>mais nous ne le recommandons pas !</strong><br>
                        Si votre site fonctionne, cette information ne devrait pas être modifiée.
                        </li>

                        <li>
                        <strong>Les balises meta</strong> sont un outil très puissant pour le référencement de votre site, mais qui nécessiterait un brin d'explication techniques que nous souhaitons vous éviter.<br>
                        Si vous savez comment fonctionnent les balises meta, vous pourrez en ajouter ici, en spécifiant leur <em>name</em> et leur <em>content.</em> Si vous ne savez pas comment elles marchent, laissez nous nous en occuper pour vous !<br>
                        D'ailleurs, le webmaster est joignable à l'adresse suivante : <strong>yapo(at)collectif8h30.fr</strong>
                        </li>
                    </ul>
                </p>
                <button type="button" class="btn btn-secondary" v-on:click="changeOnglet('onglet_prjts')">Aller à mon site</button>
            </div>
        </div>

        <div class="border-bottom">
            <button type="button" class="btn btn-lg" v-on:click="switchVisi(2)">Mes contacts</button>
            
            <div id="explics_2" class="mb-sm-3" style="display:none">
                <p>
                    Cette section est très simple à comprendre : vous pouvez, ici, modifier vos informations de contact.
                    <ul>
                        <li><strong>Votre adresse</strong> physique, cette fois</li>
                        <li><strong>Votre mail :</strong> pour des raisons de sécurité, votre adresse mail n'est pas cliquable ou écrit directement en tant que lien.<br> Concrètement, si vous écrivez yapo@collectif8h30.fr (ce qui est l'adresse où joindre le webmaster en cas de problème, l'avions-nous précisé ?), cela deviendra yapo(at)collectif8h30.fr</li>
                        <li><strong>Vos réseaux :</strong> Sous forme de liste, vous pouvez y entrer vos adresses de réseaux sociaux comme votre instagram, facebook, malt, etc.</li>
                    </ul>
                </p>
                <button type="button" class="btn btn-secondary" v-on:click="changeOnglet('onglet_contact')">Aller à mes contacts</button>
            </div>
        </div>

        <div class="border-bottom">
            <button type="button" class="btn btn-lg" v-on:click="switchVisi(3)">Mes identifiants</button>
            
            <div id="explics_3" class="mb-sm-3" style="display:none">
                <p>
                    Ce panneau est là pour vous permettre de changer votre login administrateur, ou de réinitialiser votre mot de passe.<br>
                    Les mêmes règles que lors de l'installation de votre site s'appliuent pour le mot de passe : il doit contenir <strong>au moins un caractère spécial, un chiffre et une majuscule</strong>
                </p>
                <button type="button" class="btn btn-secondary" v-on:click="changeOnglet('onglet_admin')">Aller à mes identifiants</button>
            </div>
        </div>
    </div> `
};


//Interface

var interfaceAdmin = new Vue({
    el:'#yapo_admin',
    data:{
        listeOnglets:[
            {
                'nom': 'Contenu',
                'contenu':[
                    {
                        'nom':'Mes pages',
                        'value':'onglet_prjts',
                    },
                    {
                        'nom':'Mes catégories',
                        'value':'onglet_cats',
                    },
                    {
                        'nom': 'Mes actualités',
                        'value':'onglet_actus',
                    },
                    {
                        'nom':'Mon accueil',
                        'value': 'onglet_infos',
                    },
                    {
                        'nom': 'À propos de moi',
                        'value':'a_propos', 
                    }
                ],
                'value':'accueil_prjts',
            },
            {
                'nom':'Paramètres',
                'contenu':[
                    {
                        'nom':'Mon site',
                        'value':'onglet_params',
                    },
                    {
                        'nom':'Mes contacts',
                        'value':'onglet_contact',
                    },
                    {
                        'nom':'Mes identifiants',
                        'value':'onglet_admin',
                    },
                ],
                'value':'accueil_params',
            },
        ],
        ongletActuel:'',
        refresh: '',
    },
    components:{
        'accueil_prjts': accueilProjet,
        'accueil_params': accueilParams,
        'onglet_prjts': onglet_prjts,
        'onglet_cats': onglet_cats,
        'onglet_infos': onglet_infos,
        'onglet_actus': onglet_actus,
        'a_propos':a_propos,
        'onglet_params':onglet_params,
        'onglet_contact':onglet_contact,
        'onglet_admin':onglet_admin,
    },
    methods:{
        chgOngletActuel: function(value){
            this.ongletActuel = value;
            
            ajaxGet('_php/refresh_sess.php', (retour) => {
                if(retour !== "ok"){
                    alert('Votre session a expirée, veuillez vous reconnecter');
                    document.location.reload(true);
                }
            });
            /*document.getElementById("component_col").scrollIntoView({
                behavior:'smooth', 
                block: 'start',
            });*/
        },
        whatRefresh: function(what){
            this.refresh = what;
        }
    },
    template:`
    <div class="container-sm mt-5">
        <div class="row">

            <div class="col-lg-3">
                <div v-for="(onglet, index) in listeOnglets"
                :key="index" class="mb-sm-2">
                        <button type="button" class="btn btn-primary btn-block btn-lg py-sm-1" v-on:click="chgOngletActuel(onglet.value)">{{onglet.nom}}</button>
                        <div v-for="(sousOnglet,index) in onglet.contenu"
                        :key="index">
                            <button type="button" class="btn btn-light border-top btn-block py-sm-2" v-on:click="chgOngletActuel(sousOnglet.value)">{{sousOnglet.nom}}</button>
                        </div>
                </div>
            </div>

            <div class="col-lg-9 mb-5" id="component_col">
                <keep-alive v-if="ongletActuel">
                    <component v-bind:is="ongletActuel" 
                    v-on:changeOnglet="chgOngletActuel($event)" 
                    v-on:emitRefresh="whatRefresh($event)" 
                    v-bind:_refresh="refresh"
                    class="px-md-3"></component>
                </keep-alive>

                <div v-else>
                    <h1 class="display-1" style="font-size:2.3em;">Bienvenue !</h1>
                    <p class="mb-2">
                        Vous vous trouvez actuellement à l'accueil de votre <strong>espace administrateur.</strong><br> 
                        C'est ici que vous gérez le contenu de votre site web.
                    </p>
                    <p class="mb-2">
                        Utilisez le menu à gauche pour accéder aux différentes rubriques.<br>
                        Les onglets bleus "Contenu" et "Paramètres" contiennent des informations relatives au fonctionnement des rubriques.
                    </p>
                    <p class="mb-2">
                        En cas de problème, contacter le webmaster à l'adresse suivante : yapo(at)collectif8h30.fr
                    </p>
                </div>
            </div>
        </div>
    </div> `
});

