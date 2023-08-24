import { useState,useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TextInput, Image, Touchable, TouchableOpacity, View, FlatList } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import bookImage1 from './assets/thumbnail/deathly-hallows-us-childrens-edition.jpg';
import bookImage2 from './assets/thumbnail/sm_f7e651-tolkien-lordoftherings.jpg';
import Home from './Screens/Home/home_page';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from './node_modules/react-native-safe-area-context/lib/module/SafeAreaView.macos';
import { LinearGradient } from 'expo-linear-gradient';
import { zoomIn } from './node_modules/react-native-animatable/definitions/zooming-entrances';
import Background from './node_modules/@react-navigation/elements/lib/typescript/src/Background.d';
const Stack = createNativeStackNavigator();
import eNovaBookStore from './ABI/abi.json';
import Web3 from 'web3';
import axios from 'axios';

 
export default function App() {
  const [selectedPage, setSelectedPage] = useState('Home'); 
  const [search,setSearch] = useState(false);
  const [book, setBook] = useState([]);
  const bookList = [];

  useEffect(() => {
    async function getBooks() {
      const contractAddress = '0x0b7fC760E92Eb498f1dCDF1C0856c7c256c360fE';

      const web3 = new Web3('https://goerli.infura.io/v3/376e00cbb0684049bfc81287c741e84e');
      const networkId = await web3.eth.net.getId();
      // Create a contract instance for the deployed contract
      const contract = new web3.eth.Contract(eNovaBookStore, contractAddress);
      contract.methods.getAllBooks().call().then((result) => {
        console.log(result);
        result.map((item) => {
          const newBook = {
            id: item.id,
            name: item.name,
            author: item.author,
            description: item.description,
            imageUrl: item.imageUrl,
          }
          bookList.push(newBook);
        })
        console.log(bookList);
        setBook(...book,bookList);
      }).catch((error) => {
        console.log(error);
      });
    }  
    getBooks();
  }, []);

  
  useEffect(() => {
    async function getBooks() {
      axios.get('https://enova-web2.onrender.com/book/getBooks')
      .then((response) => { 
        console.log(response.data); 
        response.data.map((item) => {
          const newBook = {
            id: item.id,
            name: item.bookName,
            author: item.bookAuthor,
            description: item.bookDescription,
            imageUrl: item.bookImage,
          }
          bookList.push(newBook);
        })
        console.log(bookList);
        setBook(bookList);
        console.log(book);
        setBook(...book,bookList);
      }) 
      .catch((error) => {
        console.log(error);
      });
    }
    
    getBooks();
  }, [ ]);


  const renderItem = ({ item }) => (
    
    <TouchableOpacity
      style={styles.bookItemWrap}
    >
      <Animatable.View animation={'bounceInLeft'} style={styles.bookItem}>
        <View style={styles.bookItemImg}>
          <Image source={{uri:item.imageUrl}} width={150} height={150} style={styles.bookItemImg} />
          <View style={styles.bookItemImgOverlay}></View>
        </View>
        <View style={styles.bookItemInfo}>
          <Animatable.Image animation={zoomIn} source={{uri:item.imageUrl}} width={150} height={150} style={styles.itemImage} />
          <Animatable.Text  animation={zoomIn} style={styles.bookItemTitle}>{item.name} </Animatable.Text>
          <Animatable.Text  animation={zoomIn} style={styles.bookItemAuthor}>{item.author}</Animatable.Text>
        </View>
      </Animatable.View>
      <Animatable.View animation={'bounceInRight'} style={styles.itemButtons}>
        <TouchableOpacity style={styles.itemButton}>
          <Ionicons name="md-reader" size={28} color="#4CB8C4" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemButton}>
          <Ionicons name="md-heart" size={28} color="#d94a4a" />
        </TouchableOpacity>
      </Animatable.View>

    </TouchableOpacity>
  );

  const renderItemHome = ({ item }) => (
    
    <TouchableOpacity
      style={styles.favWrap}
    >
      <Animatable.View animation={'bounceInLeft'} style={styles.favItem}>
        <View style={styles.favItemImg}>
          <Image source={{uri:item.imageUrl}} width={150} height={150} style={styles.bookItemImg} />
          <View style={styles.fevItemImgOverlay}></View>
        </View>
        <View style={styles.favItemInfo}>
          <Animatable.Image animation={zoomIn} source={{uri:item.imageUrl}} width={150} height={150} style={styles.ifavtemImage} />
          <Animatable.Text  animation={zoomIn} style={styles.favItemTitle}>{item.title}</Animatable.Text>
          <Animatable.Text  animation={zoomIn} style={styles.favItemAuthor}>{item.author}</Animatable.Text>
        </View>
      </Animatable.View>
    </TouchableOpacity>
  );




  return (
    <View style={styles.container}>
      <Animatable.View animation={'fadeInDownBig'} style={search?styles.headerHr:styles.headerVr}>
              <View style={styles.headerTop}>
                <Text style={styles.appName}>eNova Reader</Text>
                <TouchableOpacity onPress={() => setSearch(!search)}>
                  <Ionicons name={search?'md-close':'md-search'} size={25} color="#4CB8C4" />
                </TouchableOpacity>
              </View>
              {search ? (
                 <SafeAreaView>
                <Animatable.View animation={'bounceInRight'} style={styles.searchWrap}>
                  <TextInput style={styles.search} placeholder="Search" />
                  <TouchableOpacity>
                    <Ionicons name="md-search" size={25} color="#4CB8C4" />
                  </TouchableOpacity>
                </Animatable.View>
              </SafeAreaView>
              ) :   selectedPage == 'Home' ? (
                <Animatable.Text animation={'bounceInLeft'} style={styles.headerTitle}>Home</Animatable.Text>
              ) :  selectedPage == 'Shop' ? (
                <Animatable.Text animation={'bounceInLeft'} style={styles.headerTitle}>Shop</Animatable.Text>
              ) :  selectedPage == 'Favorite' ? (
                <Animatable.Text animation={'bounceInLeft'} style={styles.headerTitle}>Favorite</Animatable.Text>
              ): null
              }
      </Animatable.View>
      {
        selectedPage == 'Home' ? (
          <Animatable.View animation={'zoomIn'}iew style={styles.container} id={'home'}>
            
            <ScrollView style={styles.body}>
              <LinearGradient colors={['#96fffc','#80f2ef', '#69e6e3','#4fd9d6' ,'#2ccdca' ]} style={styles.topSection}>
                <Text style={styles.recentRead}>Recent Read</Text>
                <View style={styles.recentReadWrap}>
                  <TouchableOpacity style = {styles.recentReadItem}> 
                      <View style ={styles.recentReadItemImg}>
                        <Image source={bookImage2} width={150} height={150} style={styles.recentReadItemImg} />
                        <View style={styles.recentReadItemImgOverlay}></View>
                      </View> 
                      <Image source={bookImage2} width={50} height={50} style={styles.recentReadItemImage} />
                      <Text style={styles.recentReadItemTitle}>Lord of the Rings</Text>
                      <Text style={styles.recentReadItemAuthor}>J.R.R. Tolkien</Text>
                  </TouchableOpacity>
                </View>

                <Animatable.View animation={'wobble'} style={styles.shopWrap}>
                  <TouchableOpacity style={styles.favorite}>
                    <Text style={styles.favoriteTitle}>Favorite</Text>
                    <Ionicons name="md-star" size={20} color="#0c0c0c" />
                  </TouchableOpacity>
                  <View style={styles.shop}>
                    <TouchableOpacity style = {styles.shopNewItems}> 
                        <Text style={styles.itemText}>New</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.shopOldItems}> 
                        <Text style={styles.itemText}>Used</Text>
                    </TouchableOpacity>
                    </View>
                </Animatable.View>
              
              </LinearGradient>
            <LinearGradient colors={[  '#ffaebc', '#fea3b2', '#fd97a8', '#fb8b9e', '#f97f94']} style={styles.bottomSection} >
                <Text style={styles.bottomSectionTitle}>Favorite List</Text>
                      <FlatList
                        data={book}
                        renderItem={renderItemHome}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        decelerationRate="fast" 
                        horizontal={true}
                        snapToInterval={styles.bookItemWrap.height + styles.bookItemWrap.marginBottom}
                        snapToAlignment="start"
                        snapToEnd={false}
                      /> 
              </LinearGradient>
                
            </ScrollView >
            </Animatable.View>
        ) : selectedPage == 'Shop' ? (
          <View style={styles.shopContainer}>
              <FlatList
                data={book}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                decelerationRate="fast" 
                snapToInterval={styles.bookItemWrap.height + styles.bookItemWrap.marginBottom}
                snapToAlignment="start"
                snapToEnd={false}
              />
          </View>
        ) : selectedPage == 'Favorite' ? (
         <View style={styles.shopContainer}>
              <FlatList
                data={book}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                decelerationRate="fast" 
                snapToInterval={styles.bookItemWrap.height + styles.bookItemWrap.marginBottom}
                snapToAlignment="start"
                snapToEnd={false}
              />
          </View>
        ) : <Text style={{color:'#000000'}}>Error ! Page not found</Text>

      }
      
      <Animatable.View animation={'fadeInUpBig'} style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={() => setSelectedPage('Shop')}>
          <Ionicons name="md-cart" size={20} color="#0c0c0c" />
          <Text style={styles.footerItemText}>Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => setSelectedPage('Home')}>
          <Ionicons name="md-home" size={20} color="#0c0c0c" />
          <Text style={styles.footerItemText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => setSelectedPage('Favorite')}>
          <Ionicons name="md-heart" size={20} color="#0c0c0c" />
          <Text style={styles.footerItemText}>Favorites</Text>
        </TouchableOpacity>
      </Animatable.View>
   </View>

  );
}

const styles = StyleSheet.create({
  shopContainer:{
    flex: 1,
    width:'100%',
    height:'100%',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favItemInfo:{ 
    width:'100%',
    height:350,
    position:'relative',
    top:10,
    zIndex:2, 
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center',
  },
  listContent: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  favWrap:{
    width:150,
    height:250,
    backgroundColor:'#ffffff',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:10,
    top:30,
    marginLeft:10,
  },
  favItem:{
    width:150,
    height:150,
    position:'relative',
    top:0,
    backgroundColor:'#ffffff',
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center', 
    marginBottom:10,
    elevation:5,
  },
  favItemImg:{
    width:150,
    height:180,
    zIndex:1,
    borderRadius:10,
    position:'absolute',
    top:-50,
    left:0,
    zIndex:1,
  },
  favItemImgOverlay:{
    width:180,
    height:150,
    borderRadius:10,
    position:'absolute',
    top:0,
    left:0,
    zIndex:2,
    backgroundColor:'#000000',
    opacity:0.5,
  },
  favItemTitle:{
    color:'#ffffff',
    fontSize:16,
    fontWeight:'600',
    textAlign:'center',
    paddingLeft:10,
    paddingRight:10,
    elevation:5,
    zIndex:3,
    top:20,
    marginBottom:10,
  },
  ifavtemImage:{
    width:80,
    height:100,
    borderRadius:10,
    position:'absolute',
    top:50,
    elevation:5,
    zIndex:2,
  },

  favItemAuthor:{
    color:'#ffffff',
    top:20,
    zIndex:3,
    fontSize:14,
    textAlign:'center',
    elevation:5,
  },
  bookItemInfo:{
    width:'100%',
    height:350,
    position:'relative',
    top:0,
    zIndex:2, 
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center',
  },
  bookItemTitle:{
    color:'#ffffff',
    fontSize:20,
    fontWeight:'600',
    textAlign:'center',
    paddingLeft:10,
    paddingRight:10,
    elevation:5,
    marginBottom:10,
  },
  bookItemAuthor:{
    color:'#ffffff',
    fontSize:16,
    textAlign:'center',
    elevation:5,
  },
  itemButtons:{
    width:'100%',
    height:50,
    position:'absolute',
    bottom:0,
    zIndex:3,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingLeft:10,
    paddingRight:10,
    marginBottom:10,
  },
  itemButton:{
    width:50,
    height:45,
    backgroundColor:'#ffffff', 
    borderRadius:10,
    paddingLeft:10,
    paddingRight:10,
    alignItems:'center',
    justifyContent:'center',
    elevation:5,
  },
  itemButtonText:{
    color:'#807e7e',
    fontSize:10,
    fontWeight:'600',
  },
  bookItem:{
    width:'100%',
    height:350,
    position:'relative',
    top:0,
    zIndex:2,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center',
  },
  bookItemWrap:{
    width:'100%',
    position:'relative',
    height:350,
    backgroundColor:'#fbfbfb',
    alignItems:'flex-start', 
    justifyContent:'flex-start',
    borderRadius:10,
    marginBottom:10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookItemImgOverlay:{
    width:'100%',
    height:350,
    position:'absolute',
    justifyContent:'center',
    alignItems:'center',
    top:0,
    zIndex:2,
    backgroundColor:'rgba(0,0,0,0.8)',
    borderRadius:10,
  },
  bookItemImg:{
    width:'100%',
    shadowColor:'#ffffff',
    height:350,
    borderRadius:10,
    position:'absolute',
    top:0,
    zIndex:1,
  },  
  itemImage:{
    width:200,
    height:200,
    borderRadius:10,
    marginBottom:10,
    elevation:5,
  },
  container: {
    flex: 1,
    width:'100%',
    height:'100%',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    
  },
  headerHr:{
    zIndex:5,
    width:'100%',
    height:130,
    paddingTop:'8%', 
    paddingBottom:'3%',
    backgroundColor: '#ffffff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft:'5%',
    paddingRight:'5%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    
  }, 
  headerVr:{
    backgroundColor: '#ffffff',
    zIndex:5,
    width:'100%',
    height:130,
    paddingTop:'8%',  
    backgroundColor: '#ffffff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft:'5%',
    paddingRight:'5%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    
  },
  headerTop:{
    width:'100%',
    height:'50%',
    display:'flex',
    flexDirection:'row',
    position:'sticky',
    top:0,
    alignItems:'center',
    justifyContent:'space-between',
  },
  appName:{
    fontSize: 20,
    fontWeight: 'bold',
    color:'#000000',
    elevation: 5, 
    marginBottom: 10,
  },
  searchWrap:{
    zIndex:5,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor: '#c0c0c0',
    width:'80%',
    height:40, 
    elevation: 5,
    paddingLeft:'3%',
    paddingRight:'3%',
    marginLeft:'10%',
    marginRight:'10%',
    borderRadius: 10,
  },
  headerTitle:{
    fontSize: 28,
    fontWeight: 'bold',
    color:'#2e2e2e',
    elevation: 10,
  },
  search:{
    width:'90%',
    height:'100%',
    alignItems: 'center',
    justifyContent: 'center',  
    paddingLeft:'5%',
  },
  body:{
    width:'100%',
    height:'100%',
    backgroundColor: '#fffddf', 
    paddingLeft:'5%',
    paddingRight:'5%',
  },
  topSection:{
    zIndex:4,
    width:'100%',
    height:250,
    flexDirection:'row',
    backgroundColor: '#A0E7E5',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop:'5%',
    marginBottom:'2%',
    borderRadius: 10,
    elevation: 5,
  },
  recentReadWrap:{
    width:'40%',
    height:230,
    position:'relative',
    flex:1, 
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection:'row',
    paddingLeft:'3%',
    paddingBottom:'5%',
    paddingTop:'2%',
    marginRight:'5%',
    marginTop:'3%',
    marginBottom:'5%',
    paddingRight:'5%',
  },
  recentRead:{
    fontSize: 15,
    zIndex:2,
    position:'absolute',
    top:0,
    marginBottom:3,
    left:10,
    fontWeight: 'bold',
    color:'#000000',
    paddingTop:'3%',
    paddingBottom:'1%', 
    elevation: 5,
  },
  viewAll:{
    fontSize: 12,
    width:'100%',
    fontWeight: 'bold',
    color:'#000000',
    elevation: 5,
    textAlign:'center',
  },
  recentReadItem:{
    top:15,
    width:'100%',
    height:'100%',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'column', 
    borderRadius: 10,
    elevation: 5, 
  },  
  recentReadItemImg:{
    position:'absolute',
    zIndex: 1,
    width:'100%',
    height:'100%',
    backgroundColor: '#d0d0d0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row', 
    borderRadius: 10, 
  }, 
  recentReadItemImage:{
    position:'absolute',
    top:15,
    zIndex: 2,
    width:80,
    height:80,
    elevation: 5,
    borderRadius:8,
  },
  fevItemImgOverlay:{
    position:'absolute',
    zIndex: 1,
    width:'100%',
    height:200,
    backgroundColor: '#2e2e2e',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    paddingLeft:'5%',
    paddingRight:'5%',
    borderRadius: 10, 
    opacity:0.8,
  },
  recentReadItemImgOverlay:{
    position:'absolute',
    zIndex: 1,
    width:'100%',
    height:'100%',
    backgroundColor: '#2e2e2e',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    paddingLeft:'5%',
    paddingRight:'5%',
    borderRadius: 10,
    paddingTop:'5%',
    paddingBottom:'5%',
    opacity:0.8,
  },
  recentReadItemTitle:{
    zIndex: 2,
    fontSize: 15,
    position:'absolute',
    bottom:35,
    fontWeight: '700',
    textAlign:'center', 
    width:'100%',
    paddingLeft:'2%',
    color:'#ffffff', 
  },
  recentReadItemAuthor:{
    zIndex: 2,
    fontSize: 13, 
    position:'absolute',
    bottom:10,
    marginBottom:'5%',
    textAlign:'center',
    width:'100%',
    fontWeight: '500',
    color:'#ffffff', 
  },
  shopWrap:{
    position:'relative',
    width:'50%',
    height:200,
    flex:1, 
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection:'column',
    paddingLeft:'3%',
    paddingBottom:'10%', 
    paddingTop:'2%',
    paddingRight:'5%',
  },
  
  favorite:{
    width:'100%',
    height:'30%',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection:'row',
    paddingLeft:'10%',
    paddingRight:'10%',
    borderRadius: 10,
    marginBottom:'5%',
    elevation: 5,
  }, 
  favoriteTitle:{
    fontSize: 15,
    fontWeight: '600',
    color:'#1c1c1c',
    elevation: 5,
  },
  shop:{
    width:'100%',
    height:170,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection:'column',
    paddingLeft:'10%',
    paddingRight:'10%',
    paddingTop:'10%',
    paddingBottom:'10%',
    borderRadius: 10,
    position:'relative',
    elevation: 5,
  },
  shopNewItems:{
    width:'60%',
    position:'absolute',
    left:'15%',
    top:'7%',
    height:'30%',
    backgroundColor: '#B4F8C8',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    paddingLeft:'10%',
    paddingRight:'10%',
    borderRadius: 100,
    elevation: 5,
    marginBottom:'5%',
  },
  shopOldItems:{
    width:'60%',
    position:'absolute',
    bottom:'7%',
    right:'15%',
    height:'30%',
    backgroundColor: '#FFAEBC',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    paddingLeft:'10%',
    paddingRight:'10%',
    borderRadius: 100,
    marginBottom:'5%',
    elevation: 5,
  },
  itemText:{
    fontSize: 18,
    fontWeight: '600',
    color:'#575555',
    elevation: 5,
  },
  shopTitle:{
    fontSize: 18,
    fontWeight: 'bold',
    color:'#000000',
    elevation: 5,
  },
  bottomSection:{
    width:'100%',
    height:250,
    flex:1,
    paddingBottom:'3%',
    flexDirection:'row',
    backgroundColor: '#FBE7C6',  
    marginTop:'5%',
    marginBottom:'5%',
    paddingRight:'5%',
    borderRadius: 10,
    elevation: 5,
  },
  bottomSectionItem:{
    position:'relative',
    marginTop:'15%',
    width:'60%',
    height:'80%', 
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'column',
    paddingLeft:'5%',
    paddingRight:'5%',
    borderRadius: 10, 
  },
  bottomSectionItemImg:{
    position:'absolute', 
    top:-10,
    width:'100%',
    height:'100%',
    backgroundColor: '#d0d0d0',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection:'row', 
    borderRadius: 10, 
  },
  bottomSectionTitle:{
    zIndex: 2,
    position:'absolute',
    top:10,
    left:10,
    fontSize: 16,
    fontWeight: 'bold',
    color:'#000000',
    elevation: 5,
  },
  bottomSectionItemText:{
    zIndex: 2,
    fontSize: 12,
    fontWeight: 'normal',
    color:'#000000',
    elevation: 5,
  },
  bottomSectionItemTitle:{
    fontSize: 15,
    fontWeight: 'bold',
    color:'#324969',
    elevation: 5,
  },
  bottomSectionItemAuthor:{
    fontSize: 13,
    fontWeight: 'bold',
    color:'#000000',
    elevation: 5,
  },
  
  
  footer:{
    width:'100%',
    height:'80px',
    flexDirection:'row',
    backgroundColor: '#dcdcdc',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft:'5%',
    position:'sticky',
    bottom:0,
    paddingRight:'5%',
    borderRadius: 10,
    elevation: 5,
    paddingTop:'2%',
    paddingBottom:'2%',
  },
  footerItem:{
    width:'30%',
    height:55,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'column',
    paddingLeft:'5%',
    paddingRight:'5%',
    borderRadius: 10,
    elevation: 5,
  },
  footerItemText:{
    fontSize: 12,
    fontWeight: 'normal',
    color:'#000000',
    elevation: 5,
  },
  footerItemImg:{
    width:'100%',
    height:30,
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    paddingLeft:'5%',
    paddingRight:'5%',
  },
  footerItemImgActive:{
    width:'100%',
    height:30,
    backgroundColor: '#d0d0d0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    paddingLeft:'5%',
    paddingRight:'5%',
    borderRadius: 10,
    elevation: 5,
  },
  footerItemTextActive:{
    fontSize: 10,
    fontWeight: 'bold',
    color:'#000000',
    elevation: 5,
  },

  
});
