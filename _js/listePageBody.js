function getPageList(retour, id){
    ajaxPost(homeURL+'/_php/liste_prjts.php', 'cat='+this.id, getPageList, this.id, false);
        console.log(id);

        retour = JSON.parse(retour);
        retour.splice(-1,1);
        
        return retour.splice(-1,1);

        /*for(var i = 0; i < this.listePages.length; i ++){
            this.isThumbnail(this.listePages[i], id);
        }
        console.log(this.listePages);*/
}

var body = new Vue({
    el: '#liste_pages_body',
    data: function(){
        return{
            homeURL:homeURL,
            titreCat: document.getElementById('cat').textContent,
            id: false,
        }
    },
    computed:{
        pageList() {
            if(this.id){
                return getPageList(this.id);
            }
        }
    },
    components:{
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
        isThumbnail:function(page, id){
            ajaxPost(homeURL+'/_php/is_thumbnail.php', 'cat='+id+'&cle='+page.prjt_cle, (isThumb) => {
                if(isThumb !== "false"){
                    page.thumb = isThumb;
                } else {
                    page.thumb = false;
                }
            }, false);
        },
        recup:function(){
            this.id = document.getElementById('id').textContent;
        },
    },
    template:`
    <div class="col-lg-9 mb-5 page_list body">
        <h1 class="display-1 mb-2">{{titreCat}}</h1>
        
        <!--><div v-for="(item,index) in pageList"
        class="pb-2 mb-3">
            <a :href="item.prjt_cle+'/'+item.prjt_cle+'.php'" class="page_thumb mt-2">
                <div v-if="item.thumb" class="page_thumb_img">
                    <img class="img-fluid" 
                    :src="homeURL+'/'+item.thumb" :alt="item.titre">
                </div>

                {{item.titre}}
            </a>
        </div><!-->

        <p>{{ pageList }}</p>
    </div> `
});