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
        <h2>La section Pages</h2>

        <p>la section Pages est sans doute là où vous allez passer le plus de temps.<br/>
        Elle contient toutes les fonctionnalités nécessaires à la gestion au quotidien de votre site, qui sont chacunes expliquées en-dessous.<br>
        <strong>N'hésitez pas à bien vous les approprier !</strong></p>

        <div class="border-bottom">
            <button type="button" class="btn btn-lg" v-on:click="switchVisi(1)">Ajouter ou modifier une page</button>
            
            <div id="explics_1" class="mb-sm-3" style="display:none">
                <p>
                    <em>Explications en attente...</em>
                </p>
                <button type="button" class="btn btn-secondary" v-on:click="changeOnglet('onglet_prjts')">Ajouter ou modifier une page</button>
            </div>
        </div>
        
        <div class="border-bottom">
            <button type="button" class="btn btn-lg" v-on:click="switchVisi(2)">Ajouter ou modifier une catégorie</button>

            <div id="explics_2" class="mb-sm-3" style="display:none">
                <p>
                    <em>Explications en attente...</em>
                </p>
                <button type="button" class="btn btn-secondary" v-on:click="changeOnglet('onglet_cats')">Ajouter ou modifier une catégorie</button>
            </div>
        </div>

        <div class="border-bottom">
            <button type="button" class="btn btn-lg" v-on:click="switchVisi(3)">Ajouter ou modifier une actualité</button>
            
            <div id="explics_3" class="mb-sm-3" style="display:none">
                <p>
                    <em>Explications en attente...</em>
                </p>
                <button type="button" class="btn btn-secondary" v-on:click="changeOnglet('onglet_actus')">Ajouter ou modifier une actualité</button>
            </div>
        </div>

        <div class="border-bottom">
            <button type="button" class="btn btn-lg" v-on:click="switchVisi(4)">Modifier votre page d'accueil</button>

            <div id="explics_4" class="mb-sm-3" style="display:none">
                <p>
                    <em>Explications en attente...</em>
                </p>
                <button type="button" class="btn btn-secondary" v-on:click="changeOnglet('onglet_infos')">Modifier votre page d'accueil</button>
            </div>
        </div>

        <div class="border-bottom">
            <button type="button" class="btn btn-lg" v-on:click="switchVisi(5)">Modifier votre page à propos</button>

            <div id="explics_5" class="mb-sm-3" style="display:none">
                <p>
                    <em>Explications en attente...</em>
                </p>
                <button type="button" class="btn btn-secondary" v-on:click="changeOnglet('a_propos')">Modifier votre page à propos</button>
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
        <h2>La section Paramètres</h2>

        <p><em>Explications en attente</em></p>
        
        <div class="border-bottom">
            <button type="button" class="btn btn-lg" v-on:click="switchVisi(1)">Modifier les coordonnées de votre site</button>
            
            <div id="explics_1" class="mb-sm-3" style="display:none">
                <p>
                    <em>Explications en attente...</em>
                </p>
                <button type="button" class="btn btn-secondary" v-on:click="changeOnglet('onglet_prjts')">Modifier les coordonnées de votre site</button>
            </div>
        </div>

        <div class="border-bottom">
            <button type="button" class="btn btn-lg" v-on:click="switchVisi(2)">Modifier vos informations contact</button>
            
            <div id="explics_2" class="mb-sm-3" style="display:none">
                <p>
                    <em>Explications en attente...</em>
                </p>
                <button type="button" class="btn btn-secondary" v-on:click="changeOnglet('onglet_contact')">Modifier vos informations contact</button>
            </div>
        </div>

        <div class="border-bottom">
            <button type="button" class="btn btn-lg" v-on:click="switchVisi(3)">Modifier vos informations administrateurs</button>
            
            <div id="explics_3" class="mb-sm-3" style="display:none">
                <p>
                    <em>Explications en attente...</em>
                </p>
                <button type="button" class="btn btn-secondary" v-on:click="changeOnglet('onglet_admin')">Modifier vos informations administrateurs</button>
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
                <keep-alive>
                    <component v-bind:is="ongletActuel" 
                    v-on:changeOnglet="chgOngletActuel($event)" 
                    v-on:emitRefresh="whatRefresh($event)" 
                    v-bind:_refresh="refresh"
                    class="px-md-3"></component>
                </keep-alive>
            </div>
        </div>
    </div> `
});

