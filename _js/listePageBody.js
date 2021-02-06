var body = new Vue({
    el: '#liste_pages_body',
    data: function(){
        return{
            listePages: [],
            homeURL:homeURL,
            titreCat: document.getElementById('cat').textContent,
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
                    this.listePages.push(page);
                    console.log("y a une image");
                } else {
                    page.thumb = false;
                    this.listePages.push(page);
                    console.log("y a pas image");
                }
            }, false);
        },
        recup:function(){
            var id = document.getElementById('id').textContent;
            ajaxPost(homeURL+'/_php/liste_prjts.php', 'cat='+id, (retour) => {
                retour = JSON.parse(retour);

                retour.splice(-1,1);
                console.log(retour);
                
                for(var i = 0; i < retour.length; i++){
                    if(retour[i].thumb === "false"){
                        retour[i].thumb = false;
                    }
                }
                
                this.listePages = retour;
            }, false);
        },
    },
    template:`
    <div class="col-lg-9 mb-5 page_list body">
        <h1 class="display-1 mb-2">{{titreCat}}</h1>
        
        <div v-for="(item,index) in listePages"
        class="pb-2 mb-3">
            <a :href="item.prjt_cle+'/'+item.prjt_cle+'.php'" class="page_thumb mt-2">
                <div v-if="item.thumb" class="page_thumb_img">
                    <img class="img-fluid" 
                    :src="homeURL+'/'+item.thumb" :alt="item.titre">
                </div>

                {{item.titre}}
            </a>
        </div>
    </div> `
});