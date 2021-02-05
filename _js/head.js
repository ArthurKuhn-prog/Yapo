if(sessionStorage.getItem('homeURL') === null){
    homeURL = 'http://localhost/yapo';
    console.log(homeURL);
} else {
    homeURL = sessionStorage.getItem('homeURL');
}

lightbox.option({
    'fadeDuration': 200,
    'imageFadeDuration': 200,
    'resizeDuration':200,
    'showImageNumberLabel':false,
    'wrapAround':true,
})

var listePages = {
    props:{
        _nameCat:{
            type:String,
            required:true
        },
        _idCat:{
            type:String,
            required:true
        },
        _home:{
            type:String,
            required:true,
        }
    },
    data:function(){
        return{
            nameCat: this._nameCat,
            idCat: this._idCat,
            listePrjts: this.recupPrjts(this._idCat),
            home: this._home,
        }
    },
    methods:{
        recupPrjts:function(id){
            ajaxPost(this._home+'/_php/liste_prjts.php', "cat="+id, (retour) => {
                retour = JSON.parse(retour);

                retour.splice(-1,1); //Le modèle

                this.listePrjts = retour;
            }, false);
        }
    },
    template:`
    <div class="liste_pages">
        <a v-for="(item,index) in listePrjts"
        :key="index"
        :href="home+'/content/cat_'+idCat+'/'+item.prjt_cle+'/'+item.prjt_cle+'.php'"
        class="row no-gutters">
        {{item.titre}}
        </a>
    </div> `
};

var pages = new Vue({
    el:'#liste_pages',
    data: function(){
        return{
            listeCats: [],
            verifHome: false,
            homeURL: '',
            showActus: false,
            show_menuMob: false,
        }
    },
    components:{
        'listePages':listePages,
    },
    methods:{
        recupActus: function(){
            ajaxGet(this.homeURL+'/_php/is_actus.php', (retour) => {
                if(retour > 0){
                    this.showActus = true;
                }
            });
        },
        isThumbnail:function(cat){
            ajaxPost(homeURL+'/_php/is_thumbnail.php', 'cat='+cat.id+'&cle=thumbs', (isThumb) => {
                if(isThumb !== "false"){
                    cat.thumb = isThumb;
                } else {
                    cat.thumb = false;
                }
                this.listeCats.push(cat);
            }, false);
        },
        recupCats: function(){
            ajaxGet(this.homeURL+'/_php/liste_cats.php', (retour) => {
                if(retour){
                    retour = JSON.parse(retour);
                    for(var i = 0; i < retour.length; i++){
                        this.isThumbnail(retour[i]);
                    }
                }
            });
        },
        populate: function(){
            this.homeURL = homeURL;
            this.verifHome = true;
            this.recupActus();
            this.recupCats();
        },
        showMobMenu:function(){
            if(this.show_menuMob){
                this.show_menuMob = false;  
            } else {
                this.show_menuMob = true;
            }
        }
    },
    template:`
    <div>
        <div class="row no-gutters" id="nav_list">

            <div v-for="(item,index) in listeCats"
            :key="index"
            class="col-lg-12 mb-2 pb-2">
                <div>
                    <a :href="homeURL+'/content/cat_'+item.id+'/listePages.php?id='+item.id+'&cat='+item.cat" class="titre_cat">
                    {{item.cat}}</a>

                    <listePages v-bind:_nameCat="item.cat"
                    v-bind:_idCat="item.id"
                    v-bind:_home="homeURL">
                    </listePages>
                </div>
            </div>

            <div v-if="showActus" class="col-lg-12 mb-2 titre_cat">
                <a :href="homeURL+'/actus.php'">Actualités</a>
            </div>

            <div v-if="verifHome" class="col-lg-12 mb-2 titre_cat">
                <a :href="homeURL+'/apropos.php'">À propos</a>
            </div>

        </div>

        <div class="row no-gutters" id="nav_list_mobile" v-if="show_menuMob">
            <div v-for="(item,index) in listeCats"
            :key="index"
            class="col-lg-12 mb-2 ">
                <div>
                    <a :href="homeURL+'/content/cat_'+item.id+'/listePages.php?id='+item.id+'&cat='+item.cat" class="titre_cat">
                    {{item.cat}}</a>
                </div>
            </div>

            <div v-if="showActus" class="col-lg-12 mb-2 ">
                <a :href="homeURL+'/actus.php'">Actualités</a>
            </div>

            <div v-if="verifHome" class="col-lg-12 mb-2 ">
                <a :href="homeURL+'/apropos.php'">À propos</a>
            </div>
        </div>
    </div> `
});

ajaxGet(homeURL+'/_php/get_head.php', (retour) => {
    var head = JSON.parse(retour);
    
    titre = head.titre;
    
    homeURL = head.site_root;
    sessionStorage.setItem('homeURL', homeURL);
    
    pages.populate();
    footer.populate();
    
    var metaTags = head.tags_meta !== "[]" && head.tags_meta !== "" ? JSON.parse(head.tags_meta) : false;
    var headerImg = head.header_img !== "[]" && head.header_img !== "" ? JSON.parse(head.header_img) : false;
    
    var titleElt = document.querySelector('title');
    titleElt.textContent = titre + titleElt.textContent;
    
    var docHead = document.querySelector('head');
    docHead.appendChild(titleElt);
    
    if(metaTags){
        for(var i =0; i < metaTags.length; i++){
            var metaElt = document.createElement('meta');
            metaElt.name = metaTags[i].name;
            metaElt.content = metaTags[i].content;
            
            docHead.appendChild(metaElt);
        }
    }
    
    var linkTitre = document.getElementById("linkTitre");
    linkTitre.href = homeURL;
    linkTitre.textContent = titre;
    
    if(headerImg){
        var img_linkTitre = document.createElement('img');
        console.log(headerImg[0].url);
        img_linkTitre.src = homeURL+'/'+headerImg[0].url;
        img_linkTitre.alt = 'image d\'en-tête du site';
        img_linkTitre.classList.add('img-fluid');
        
        linkTitre.textContent = '';
        linkTitre.appendChild(img_linkTitre);
    }
    
    if(body){
        body.recup();
    }
});

if(document.getElementById("bouton_menu_mobile") !== undefined){
    var menumob_img = document.createElement('img');
    menumob_img.src = homeURL+'/_css/menumob_icon-01.svg';
    menumob_img.style.width = "25%";
    document.getElementById("bouton_menu_mobile").appendChild(menumob_img);
    document.getElementById("bouton_menu_mobile").addEventListener("click", function(){
        pages.showMobMenu();
    })
}