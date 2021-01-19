var body = new Vue({
    el: '#accueil_body',
    data: function(){
        return{
            titrePage: '',
            datePage:'',
            okRecup: false,
            
            contenuPage: '',
            randomImg: [],
        }
    },
    components:{
        'txt_long':txt_long,
        'media':media,
        'upl_fchs':upl_fchs,
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
        recup:function(){
            ajaxGet(homeURL+'/_php/recup_accueil.php', (retour) => {
                retour = JSON.parse(JSON.parse(retour));
                if(retour !== null){
                    this.contenuPage = retour;
                }
                
                this.okRecup = true;
            }, true);
        },
    },
    template:`
    <div class="col-lg-9 mb-5 body" v-if="okRecup">

        <div v-for="(item,index) in contenuPage" :key="index">
            <component v-bind:is="item.type" :_contenu="item.contenu">
            </component>
        </div>
        
    </div> `
})