var actu = {
    props:{
        _contenu:{
            type: String,
            required: true,
        }
    },
    data: function(){
        return{
            contenuPage: '',
        }
    },
    components:{
        'txt_court':txt_court,
        'txt_long':txt_long,
        'media':media,
        'upl_fchs':upl_fchs,
    },
    created:function(){
        this.contenuPage = JSON.parse(this._contenu);
    },
    template:`
    <div>
        <div v-for="(item,index) in contenuPage" :key="index">
            <component v-bind:is="item.type" :_contenu="item.contenu">
            </component>
        </div>
    </div> `
};

var body = new Vue({
    el: '#actus_body',
    data: function(){
        return{
            listeActus: [],
        }
    },
    components:{
        'actu':actu,
    },
    methods:{
        populate_headers:function(titre, contenu){
            var headTitre = document.querySelector("title");
            
            headTitre.textContent += ' - ' + titre;
            
            var descriptionElt = document.createElement('meta');
            descriptionElt.name = 'description';
            descriptionElt.content = contenu;

            document.querySelector('head').appendChild(descriptionElt);
        },
        isThumbnail:function(actu){
            actu.show = false;
                    
            ajaxPost(homeURL+'/_php/is_thumbnail.php', 'cat=actu&cle='+actu.prjt_cle, (isThumb) => {
                if(isThumb !== "false"){
                    actu.thumb = isThumb;
                    this.listeActus.push(actu);
                } else {
                    actu.thumb = false;
                    this.listeActus.push(actu);
                }

            }, false);
        },
        recup:function(){
            ajaxGet(homeURL+'/_php/recup_actus.php', (retour) => {
                retour = JSON.parse(retour);
                
                for(var i = 0; i < retour.length; i++){
                    this.isThumbnail(retour[i]);
                }
            });
        },
        showActu(index){
            if(this.listeActus[index].show === false){
                this.listeActus[index].show = true;
            } else {
                this.listeActus[index].show = false;
            }
        }
    },
    template:`
    <div class="col-lg-9 mb-5 page_list body">
        <h1 class="display-1 mb-2">Actualités</h1>
        
        <div v-for="(item,index) in listeActus"
        class="pb-2 mb-3">
            <a :href="'#'+item.titre" v-on:click="showActu(index)" class="page_thumb mt-2">
                <div v-if="item.thumb" class="page_thumb_img">
                    <img class="img-fluid" 
                    :src="item.thumb" :alt="item.titre">
                </div>

                <div class="row no-gutters align-items-center justify-content-between">
                    {{item.titre}}

                    <em class="small">{{item.date}}</em>
                </div>
            </a>

            <div v-if="item.show">
                <actu v-bind:_contenu="item.contenu_json"></actu>
            </div>
        </div>
        
    </div> `
});