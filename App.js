import {
  SafeAreaView,
  ScrollView,
  textarea,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
} from 'react-native';

import firebase from '@react-native-firebase/app'
import React, { Component } from 'react';
import firestore from '@react-native-firebase/firestore';
import { FireSQL } from 'firesql';
import 'firebase/firestore';
//import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
const dbRef = firebase.firestore();
const fireSQL = new FireSQL(dbRef);
class Gun_class {
  constructor(gun, toplamkisisayisi,toplamucret,trips) {
    this.gun = gun; //Ayın hangi günü örnek 1,2,15
    this.toplamkisisayisi = toplamkisisayisi; //Toplam kişi sayısı
    this.toplamucret = toplamucret; //Toplam ücret
    this.trips = trips;     //Sefer sayısı
    this.ortalamaucret=toplamucret/trips;  //Ortalama ücret
    this.yukleme=false;
  }
}
class Location {
  constructor(longitude,latitude){
      this.latitude=latitude;
      this.longitude=longitude;
  }
}
var Locations=[4];

const oldbitis = { latitude: 42.2929175, longitude: -71.0548235 };
const GOOGLE_MAPS_APIKEY = 'AIzaSyA9yCha-TQLVp_fd1cDJdgR10nhD9RLXyU';
var gunler=[];
var Trips=[];
 class App extends React.Component {
   
constructor(props) {
  super(props)
  this.state = {
    sorgu1:"sa",
    sorgu2:"",
    sorgu3:"",
   baslangic: null,
   bitis: null,
    baslangic1 : null,
    bitis1 : null,
  }
}


  componentDidMount(){
    sorgu1degisme = e => {
      this.setState({sorgu1: e})
    }
    sorgu2degisme = e => {
      this.setState({sorgu2: e})
    }
    sorgu3degisme = e => {
      this.setState({sorgu3: e})
    }
    baslangicdegisim = e => {
      this.setState({baslangic: e})
      console.log("DEGİSİM"+this.state.baslangic.latitude)
      console.log("DEGİSİM1"+this.state.baslangic.longitude)
     
    }
    bitisdegisim = e => {
      this.setState({bitis: e})
       console.log("DEGİSİM"+this.state.bitis.latitude)
       console.log("DEGİSİM1"+this.state.bitis.longitude)
    }
    baslangic1degisim = e => {
      this.setState({baslangic1: e})
      console.log("DEGİSİM"+this.state.baslangic1.latitude)
      console.log("DEGİSİM1"+this.state.baslangic1.longitude)
     
    }
    bitis1degisim = e => {
      this.setState({bitis1: e})
      console.log("DEGİSİM"+this.state.bitis1.latitude)
      console.log("DEGİSİM1"+this.state.bitis1.longitude)
    }
    const {sorgu1,sorgu2,sorgu3} =this.state;
    const config = {
      apiKey: 'AIzaSyBsUynFYXPqXiko4NtIqtHYkeoZKP1_P00',
      authDomain: 'rntaxi.firebaseapp.com',
      databaseURL: 'https://rntaxi-4436c-default-rtdb.firebaseio.com/',
      projectId: 'rntaxi-4436c"',
      storageBucket: 'rntaxi-4436c".appspot.com',
      messagingSenderId: '971494136283',
      appId: "1:971494136283:android:b4f778b3fbdedf16e7effe",
      };
      if (!firebase.apps.length) {
      firebase.initializeApp(config);
       } 
       
  var toplamkisisayilari=[];
  for (let i = 0; i < 24; i++) {
    toplamkisisayilari[i]=0;
  }
  var counts=[];
  for (let i = 1; i < 24; i++) {
    counts[i]=0;
  }
  var toplamucretler=[];
  for (let i = 1; i < 24; i++) {
    toplamucretler[i]=0;
  }

async function typequery() {
await firestore()
.collection('tripdata')
.get()
.then(querySnapshot => {
  querySnapshot.forEach(documentSnapshot => {
    if(documentSnapshot.data().passenger_count!=undefined){
    var str=documentSnapshot.data().tpep_pickup_datetime.toString();
    var res=str.split(" ");
    var gun_ayırma=res[0].split("-");
    gun=gun_ayırma[2];
    sonhal_gun=gun.split('0');
    if(gun==10 || gun==20 || gun==30){
      toplamkisisayilari[gun]+=documentSnapshot.data().passenger_count;
      counts[gun]+=1;
      toplamucretler[gun]+=documentSnapshot.data().total_amount;
    }
    else if(sonhal_gun[1]!=undefined){
      toplamkisisayilari[sonhal_gun[1]]+=documentSnapshot.data().passenger_count;
      counts[sonhal_gun[1]]+=1;
      toplamucretler[sonhal_gun[1]]+=documentSnapshot.data().total_amount;
    }
    else {
      toplamkisisayilari[gun]+=documentSnapshot.data().passenger_count;
      counts[gun]+=1;
      toplamucretler[gun]+=documentSnapshot.data().total_amount;
    }
    
    if(documentSnapshot.data().passenger_count>=3 && documentSnapshot.data().trip_distance > 0){
      if(documentSnapshot.data().DOLocationID < 264 && documentSnapshot.data().PULocationID< 264){
        if(documentSnapshot.data().DOLocationID!=documentSnapshot.data().PULocationID)
        Trips.push(documentSnapshot);
      }

    }
    }

  });
});
 
console.log("Ücret ortalamaları:")
console.log(toplamkisisayilari[2])
for (let i = 1; i < toplamucretler.length; i++) {
  console.log("Gün: "+i+"       Toplam kişi sayısı: "+toplamkisisayilari[i]+"      Toplam ücret: "+toplamucretler[i]+"      Sefer sayısı: "+counts[i]);
  var ortalamaucret=toplamucretler[i]/counts[i];
    console.log(" Ortalama ücret: "+ortalamaucret);
   gunler.push(new Gun_class(i,toplamkisisayilari[i],toplamucretler[i],counts[i]))
}


//Yolcu sayısına göre sıralama yapalım
function bubble_sort_Yolcular(a)
{
    var degisim;
    var n = a.length-1;
    var x=a;
    do {
        degisim = false;
        for (var i=0; i < n; i++)
        {
            if (x[i].toplamkisisayisi < x[i+1].toplamkisisayisi)
            {
               var temp = x[i];
               x[i] = x[i+1];
               x[i+1] = temp;
               degisim = true;
            }
        }
        n--;
    } while (degisim);
 return x; 
}

 bubble_sort_Yolcular(gunler);
//Tip 1 sorgunun cevabı
console.log("En yüksek yolcu sayısına sahip ilk 5 gün  ! Sorgu 1 !")
var sorgu1str="En yüksek yolcu sayısına sahip ilk 5 gün  !  Sorgu 1 !\n";
for (let i = 0; i <5; i++) {
  var stx="Gün :"+gunler[i].gun+"\n Toplam yolcu sayısı: "+gunler[i].toplamkisisayisi+"\n Toplam ücret: "+gunler[i].toplamucret+"\n Sefer sayısı: "+gunler[i].trips+"\n Ortalama ücret: "+gunler[i].ortalamaucret+"\n";
    console.log(gunler[i]);
    sorgu1str+=stx;
}
sorgu1degisme(sorgu1str);
function bubble_Sort_ortalamaucrets(a)
{
    var degisim;
    var n = a.length-1;
    var x=a;
    do {
        degisim = false;
        for (var i=0; i < n; i++)
        {
            if (x[i].ortalamaucret > x[i+1].ortalamaucret)
            {
               var temp = x[i];
               x[i] = x[i+1];
               x[i+1] = temp;
               degisim = true;
            }
        }
        n--;
    } while (degisim);
 return x; 
}

//Tip 2 sorgu
//Ortalama ücrete göre sıralanacak,ilk 2 sinin arasındaki günleri yazdıracağız
bubble_Sort_ortalamaucrets(gunler)
console.log("=========================En az ücret alınan ilk 2 gün========================= ")
var sorgu2str="En az ücret alınan ilk 2 gün !Sorgu 2 !\n";
for (let i = 0; i <2; i++) {
  var stx="Gün :"+gunler[i].gun+"\n Toplam yolcu sayısı: "+gunler[i].toplamkisisayisi+"\n Toplam ücret: "+gunler[i].toplamucret+"\n Sefer sayısı: "+gunler[i].trips+"\n Ortalama ücret: "+gunler[i].ortalamaucret+"\n";
    console.log(gunler[i]);
    sorgu2str+=stx;
}

var ilkgun=0;
var sonhal_gun=0;
if(gunler[0].gun<gunler[1].gun){
    ilkgun=gunler[0].gun;
    sonhal_gun=gunler[1].gun;
}
else {
  ilkgun=gunler[1].gun;
  sonhal_gun=gunler[0].gun;
}
//Önce gunler dizisini tekrar günlere göre sıralayalım
function bubble_Sort_gunler(a)
{
    var degisim;
    var n = a.length-1;
    var x=a;
    do {
        degisim = false;
        for (var i=0; i < n; i++)
        {
            if (x[i].gun > x[i+1].gun)
            {
               var temp = x[i];
               x[i] = x[i+1];
               x[i+1] = temp;
               degisim = true;
            }
        }
        n--;
    } while (degisim);
 return x; 
}
bubble_Sort_gunler(gunler);
//En az ücret alınan 2 gün
console.log("ilkgun :"+ilkgun+" sonhal_gun:"+sonhal_gun);
//Tip 2 sorgunun cevabı
console.log("=========================En az ücret alınan 2 gün arasındaki günler ve ortalama alınan ücret (ortalamaucret)  ! Tip 2 Sorgu 2 !=========================") //Şu an yazdırmaya en az ücret alınan 2 gün de dahil arasındakiler+kendileri
sorgu2str+="\n Arasındaki günler:\n"
for (let i = ilkgun+1; i < sonhal_gun; i++) {
  var stx="Gün :"+gunler[i-1].gun+"\n Toplam yolcu sayısı: "+gunler[i-1].toplamkisisayisi+"\n Toplam ücret: "+gunler[i-1].toplamucret+"\n Sefer sayısı: "+gunler[i-1].trips+"\n Ortalama ücret: "+gunler[i-1].ortalamaucret+"\n";
      console.log(gunler[i-1]); // 1.gün dizide 0.gün olduğu için -1
      sorgu2str+=stx;
}

sorgu2degisme(sorgu2str)
function bubble_Sort_Distance(a)
{
    var degisim;
    var n = a.length-1;
    var x=a;
    do {
        degisim = false;
        for (var i=0; i < n; i++)
        {
            if (x[i].data().trip_distance < x[i+1].data().trip_distance)
            {
               var temp = x[i];
               x[i] = x[i+1];
               x[i+1] = temp;
               degisim = true;
            }
        }
        n--;
    } while (degisim);
 return x; 
}
bubble_Sort_Distance(Trips);
console.log("sorgu 3");
console.log("En az 3 yolcu En uzun mesafe:"+Trips[0].data().trip_distance+" DOLocationid:"+Trips[0].data().DOLocationID+" PULocationid:"+Trips[0].data().PULocationID);
console.log("En az 3 yolcu kısa mesafe :"+Trips[Trips.length-1].data().trip_distance+" DOLocationid:"+Trips[Trips.length-1].data().DOLocationID+" PULocationid:"+Trips[Trips.length-1].data().PULocationID)
var trip0baslangicalani=Trips[0].data().DOLocationID;
var trip0bitisalani=Trips[0].data().PULocationID;
var trip1baslangicalani=Trips[Trips.length-1].data().DOLocationID;
var trip1bitisalani=Trips[Trips.length-1].data().PULocationID;
var sorgu3str="En kısa ve en uzun yolculuk! Tip 3 Sorgu 3 !\n";

await firestore()
.collection('taxizones')
.get()
.then(querySnapshot => {
  querySnapshot.forEach(documentSnapshot => {
    if(documentSnapshot.data().LocationID==trip0baslangicalani){
      Locations[0]=new Location(documentSnapshot.data().longitude,documentSnapshot.data().latitude);
     
      sorgu3str+="En uzun trip başlangıç Locationid:"+documentSnapshot.data().LocationID+" \n Zone: "+documentSnapshot.data().zone+" Latitude:"+documentSnapshot.data().latitude+" Longitude:"+documentSnapshot.data().longitude+"\n";
    }
  if(documentSnapshot.data().LocationID==trip0bitisalani){
    Locations[1]=new Location(documentSnapshot.data().longitude,documentSnapshot.data().latitude);
   
    sorgu3str+="En uzun trip bitiş Locationid:"+documentSnapshot.data().LocationID+" \n Zone: "+documentSnapshot.data().zone+" Latitude:"+documentSnapshot.data().latitude+" Longitude:"+documentSnapshot.data().longitude+"\n";
  }
if(documentSnapshot.data().LocationID==trip1baslangicalani){
  Locations[2]=new Location(documentSnapshot.data().longitude,documentSnapshot.data().latitude);
  
  sorgu3str+="En kısa trip başlangıç DOLocationid: "+documentSnapshot.data().LocationID+" \n Zone: "+documentSnapshot.data().zone+" Latitude:"+documentSnapshot.data().latitude+" Longitude:"+documentSnapshot.data().longitude+"\n";
}
if(documentSnapshot.data().LocationID==trip1bitisalani){
Locations[3]=new Location(documentSnapshot.data().longitude,documentSnapshot.data().latitude);

sorgu3str+="En kısa trip bitiş PULocationid:"+documentSnapshot.data().LocationID+"\n Zone: "+documentSnapshot.data().zone+" Latitude:"+documentSnapshot.data().latitude+" Longitude:"+documentSnapshot.data().longitude+"\n";
}
  }
  );
});
//this.prop
   async function locationdegistirme(){
    baslangicdegisim(Locations[0]);
    bitisdegisim(Locations[1]);
    baslangic1degisim(Locations[2]);
    sorgu3degisme(sorgu3str);
    bitis1degisim(Locations[3]);
  }
  await locationdegistirme();
  locationschanged=true;  
}

typequery(sorgu1,sorgu2,sorgu3,sorgu1degisme,sorgu2degisme,sorgu3degisme);

}


  render() {
    return (
      <ScrollView>
<View>

<Text>{gunler[1] === undefined ? (
  <Text>Sorgu 1 yükleniyor</Text>
)  : (
  <Text>{this.state.sorgu1}
    </Text>
)
}</Text>

<Text>{gunler[1] === undefined ? (
  <Text>Sorgu 2 yükleniyor</Text>
)  : (
  <Text>{this.state.sorgu2}
    </Text>
)
}</Text>

</View>
<View style={styles.container}>

{this.state.baslangic!==null && this.state.baslangic1!==null && this.state.bitis!==null && this.state.bitis1!==null     ? (
  <MapView style={styles.map}  initialRegion={{
    latitude: 40.730610,
    longitude: -73.935242,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  }}>
  <MapViewDirections
    origin={this.state.baslangic} //The baslangic location to start routing from.
    destination={this.state.bitis}  //The bitis location to start routing to.
    apikey={GOOGLE_MAPS_APIKEY}
    strokeWidth={5}
    strokeColor="hotpink"
  />
   <MapViewDirections
    origin={this.state.baslangic1} //The baslangic location to start routing from.
    destination={this.state.bitis1}   //The bitis location to start routing to.
    strokeWidth={5}
    strokeColor="red"
    apikey={GOOGLE_MAPS_APIKEY}
  />
 
</MapView>
) : (
  <Text>Map yükleniyor...</Text>
)}

</View>

<View>
<Text>{gunler[1] === undefined ? (
  <Text>Sorgu 3 yükleniyor</Text>
)  : (
  <Text>{this.state.sorgu3}
    </Text>
)
}</Text>
</View>
  </ScrollView >
     
  
    
    );
  }
}
const styles = StyleSheet.create({
  container: {
  
    height: 350,
    width: 420,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  text:{
    backgroundColor:'red'
  }
 });
export default App;
