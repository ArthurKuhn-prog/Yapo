var body = new Vue({
    el: '#page_body',
    data: function(){
        return{
            titrePage: '',
            datePage:'',
            okRecup: false,
            
            contenuPage:'',
        }
    },
    components:{
        'txt_court':txt_court,
        'txt_long':txt_long,
        'media':media,
        'liste_infos':liste_infos,
        'upl_fchs':upl_fchs,
    },
    methods:{
        populate_headers:function(titre, contenu){
            var headTitre = document.querySelector("title");
            
            headTitre.textContent += ' - ' + titre;
            
            var descriptionElt = document.createElement('meta');
            descriptionElt.name = 'description';
            descriptionElt.content = contenu;
            
            var keywordElt = document.createElement('meta');
            descriptionElt.name = 'keyword';
            descriptionElt.content = titre;

            document.querySelector('head').appendChild(descriptionElt);
            document.querySelector('head').appendChild(keywordElt);
        },
        recup:function(){
            let formData = new FormData();
            formData.set('cle', document.getElementById("cle").textContent);
            formData.set('cat', document.getElementById("cat").textContent);
            ajaxPost(homeURL+'/_php/recup_page.php', formData, (retour) => {
                retour = JSON.parse(retour);
                
                this.titrePage = retour.titre;
                this.datePage = retour.date;
                
                this.contenuPage = JSON.parse(retour.contenu_json);
                console.log(this.contenuPage);
                
                for(var i = 0; i < this.contenuPage.length; i++){
                    if(this.contenuPage[i].type === "txt_long"){
                        this.populate_headers(this.titrePage, this.contenuPage[i].contenu);
                        break;
                    }
                }
                
                
                this.okRecup = true;
            }, true);
        },
    },
    template:`
    <div class="col-lg-9 mb-5 body" v-if="okRecup">
        <h1 class="display-1 mb-2">{{titrePage}}</h1>
        <!--<em class="small">{{datePage}}</em>-->

        <div v-for="(item,index) in contenuPage" :key="index">
            <component v-bind:is="item.type" :_contenu="item.contenu">
            </component>
        </div>
    </div> `
});