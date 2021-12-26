<template>
  <div>
    <button @click="click_to_edit">{{edit_button}}</button>
    <div v-if="!click_to_edit_category" >
      <pre>{{category_data}}</pre>
    </div>
    <div v-else>
      <button class="save_button" @click="click_category_save">save</button>
      <p>{{category_json_to_string}}</p>
     <!-- <textarea class="category_text_area" v-model="category_json_to_string" ></textarea>-->
      <p>category1_id: <input type="text" placeholder="ex) 0" v-model="category1_id"/></p>
      <p>category1_name: <input type="text" placeholder="ex) 제품문의" v-model="category1_name"/></p>
      <p>category2_id: <input type="text" placeholder="ex) 0" v-model="category2_id"/></p>
      <p>category2_name: <input type="text" placeholder="ex) 재고 문의" v-model="category2_name"/></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
  export default {
    name: "CategoryPost",
    data(){
      return{
        edit_button: '수정하기',
        click_to_edit_category: false,
        category_json_to_string: '',
        category_data: [],
        category1_id: '',
        category1_name: '',
        category2_id: '',
        category2_name: '',
      }
    },
    methods:{
      click_to_edit(){
        if(this.click_to_edit_category === false){
          this.edit_button = '취소';
          this.category_json_to_string = JSON.stringify(this.category_data)
          return this.click_to_edit_category = true
        }else{
          this.edit_button = '수정하기';
          return this.click_to_edit_category = false
        }
      },
      click_category_save(){
        this.category_data = this.category_json_to_string;
        console.log('get category data!!!', this.category_data, JSON.parse(this.category_json_to_string))
        let body ={
          "id": 0,
          "category1_id": this.category1_id,
          "category1_name": this.category1_name,
          "category2_id": this.category2_id,
          "category2_name": this.category2_name
        };
        let category_post_url = `${this.$get_api_host()}/bmwgs/api/v1.0/category/`;
        axios.post(category_post_url, body,
          {headers: {"Content-Type": `application/json`},
        })
          .then(res =>{
            console.log(res)
            this.get_category_data()
          });
      },
      get_category_data(){
        let category_url = `${this.$get_api_host()}/bmwgs/api/v1.0/category/`;
        this.$call_api(category_url, data =>{
          console.log(data, typeof(data));
          this.category_data = data;
          this.category_json_to_string = this.category_data
          console.log(typeof(this.category_data))
        })
      }
    },
    created(){
     this.get_category_data();
    },

  }
</script>

<style scoped>
/*변경 시작-CategoryPost*/
.category_text_area{ width: 500px; height: 500px; text-align: center}
/*변경 종료*/
</style>
