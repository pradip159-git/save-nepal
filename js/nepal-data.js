// Nepal Administrative Data - 7 Provinces, 77 Districts, Wards & Toles
const NEPAL_DATA = {
  "Koshi Province": {
    districts: {
      "Taplejung": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Taplejung Bazar","Phungling","Sirijanga","Thotne","Maiwa","Kabeli"] },
      "Panchthar": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Phidim","Hilihang","Tumbewa","Miklajung","Puwamajhuwa"] },
      "Ilam": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Ilam Bazar","Suryodaya","Mai","Deumai","Sandakpur"] },
      "Jhapa": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11","Ward 12"], toles: ["Birtamod","Damak","Mechinagar","Kankai","Bhadrapur","Arjundhara","Shivasatakshi"] },
      "Morang": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11"], toles: ["Biratnagar","Urlabari","Pathri","Sundarharaicha","Letang","Belbari","Rangeli"] },
      "Sunsari": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Inaruwa","Itahari","Dharan","Barahaxetra","Bhokraha","Ramdhuni"] },
      "Dhankuta": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Dhankuta Bazar","Hile","Pakhribas","Sangurigadhi","Chhathar"] },
      "Terhathum": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8"], toles: ["Myanglung","Aathrai","Chhathar Jorpati","Menchyayem"] },
      "Sankhuwasabha": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Khandbari","Chainpur","Dharmadevi","Panchkhapan","Madi"] },
      "Khotang": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8"], toles: ["Diktel","Halesi-Tuwachung","Lamidanda","Barahapokhari"] },
      "Bhojpur": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Bhojpur Bazar","Shadananda","Tyamke Bhanjyang","Hatuwagadhi"] },
      "Solukhumbu": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Salleri","Sotang","Khumjung","Namche Bazar","Phaplu"] },
      "Okhaldhunga": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8"], toles: ["Okhaldhunga Bazar","Siddhicharan","Molung","Chisankhugadhi"] },
      "Udayapur": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Triyuga","Katari","Belaka","Rautamai","Sunkoshi","Udayapurgadhi"] }
    }
  },
  "Madhesh Province": {
    districts: {
      "Saptari": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Rajbiraj","Kanchanrup","Tilathi Koiladi","Balan-Bihul","Shambhunath"] },
      "Siraha": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Siraha Bazar","Lahan","Golbazar","Mirchaiya","Dhangadhimai"] },
      "Dhanusha": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11"], toles: ["Janakpur","Dhanushadham","Mithila","Hansapur","Sabaila","Kamala"] },
      "Mahottari": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Jaleshwar","Bardibas","Manra Siswa","Ramgopalpur","Pipra"] },
      "Sarlahi": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11"], toles: ["Malangwa","Hariwan","Kabilasi","Ishworpur","Balara","Basbariya"] },
      "Rautahat": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Chandrapur","Rajpur","Gaur Bisrampurgadhi","Dewahi Gonahi","Brindaban"] },
      "Bara": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11"], toles: ["Kalaiya","Jitpur Simara","Pheta","Prasauni","Nijgadh","Kolhabi"] },
      "Parsa": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Birgunj","Pokhariya","Parsagadhi","Bahudarmai","Jagarnathpur"] }
    }
  },
  "Bagmati Province": {
    districts: {
      "Sindhuli": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Sindhuli Bazar","Kamalamai","Dudhauli","Sunkoshi","Tinpatan"] },
      "Ramechhap": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Manthali","Ramechhap Bazar","Umakunda","Likhu Tamakoshi","Doramba"] },
      "Dolakha": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Charikot","Bhimeshwar","Jiri","Tamakoshi","Kalinchok"] },
      "Sindhupalchok": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Chautara","Melamchi","Barhabise","Helambu","Indrawati","Jugal"] },
      "Kavrepalanchok": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11"], toles: ["Dhulikhel","Banepa","Panauti","Namobuddha","Panchkhal","Khanikhola"] },
      "Lalitpur": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11","Ward 12","Ward 13","Ward 14","Ward 15","Ward 16","Ward 17","Ward 18","Ward 19","Ward 20","Ward 21","Ward 22","Ward 23","Ward 24","Ward 25","Ward 26","Ward 27"], toles: ["Mangalbazar","Pulchowk","Jawalakhel","Lagankhel","Patan Dhoka","Kupondole","Satdobato","Imadol","Ekantakuna","Tikabhairab"] },
      "Bhaktapur": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11","Ward 12","Ward 13","Ward 14","Ward 15","Ward 16","Ward 17","Ward 18","Ward 19","Ward 20"], toles: ["Bhaktapur Durbar Square","Suryabinayak","Madhyapur Thimi","Nagarkot","Lokanthali","Sallaghari"] },
      "Kathmandu": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11","Ward 12","Ward 13","Ward 14","Ward 15","Ward 16","Ward 17","Ward 18","Ward 19","Ward 20","Ward 21","Ward 22","Ward 23","Ward 24","Ward 25","Ward 26","Ward 27","Ward 28","Ward 29","Ward 30","Ward 31","Ward 32"], toles: ["Thamel","Baneshwor","New Baneshwor","Putalisadak","Lazimpat","Baluwatar","Maharajgunj","Chabahil","Bouddha","Koteshwor","Gongabu","Kalanki","Balkhu","Kirtipur"] },
      "Nuwakot": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Bidur","Belkotgadhi","Tadi","Kakani","Shivapuri","Dupcheshwar"] },
      "Rasuwa": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8"], toles: ["Dhunche","Gosaikunda","Naukunde","Langtang","Kalika"] },
      "Dhading": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Dhadingbesi","Nilkantha","Thakre","Gajuri","Benighat Rorang"] },
      "Makwanpur": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11"], toles: ["Hetauda","Thaha","Manahari","Raksirang","Bhimphedi","Indrasarowar"] },
      "Chitwan": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11","Ward 12","Ward 13","Ward 14","Ward 15","Ward 16","Ward 17","Ward 18","Ward 19","Ward 20","Ward 21","Ward 22","Ward 23","Ward 24","Ward 25","Ward 26","Ward 27","Ward 28","Ward 29"], toles: ["Bharatpur","Ratnanagar","Rampur","Khairhani","Kalika","Ichchhakamana"] }
    }
  },
  "Gandaki Province": {
    districts: {
      "Gorkha": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Gorkha Bazar","Palungtar","Arughat","Barpak-Sulikot","Siranchowk"] },
      "Manang": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6"], toles: ["Chame","Manang Ngisyang","Nar-Phu","Nashong"] },
      "Mustang": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7"], toles: ["Jomsom","Lo Manthang","Thasang","Lomanthang","Gharpajhong"] },
      "Myagdi": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Beni","Annapurna","Malika","Mangala","Dhawalagiri"] },
      "Kaski": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11","Ward 12","Ward 13","Ward 14","Ward 15","Ward 16","Ward 17","Ward 18","Ward 19","Ward 20","Ward 21","Ward 22","Ward 23","Ward 24","Ward 25","Ward 26","Ward 27","Ward 28","Ward 29","Ward 30","Ward 31","Ward 32","Ward 33"], toles: ["Pokhara","Lekhnath","Machhapuchhre","Rupa","Madi","Annapurna","Lakeside","New Road","Bagar"] },
      "Lamjung": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Besisahar","Sundarbazar","Rainas","Dordi"] },
      "Tanahun": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11"], toles: ["Damauli","Bhimad","Byas","Vyas Municipality","Shuklagandaki"] },
      "Nawalpur": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11"], toles: ["Kawasoti","Binayi Triveni","Bulingtar","Devchuli","Hupsekot"] },
      "Syangja": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Putalibazar","Galyang","Bhirkot","Waling","Arjunchaupari"] },
      "Parbat": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Kushma","Painyu","Jaljala","Modi","Mahashila"] },
      "Baglung": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11"], toles: ["Baglung Bazar","Dhorpatan","Burtibang","Bareng","Kathekhola"] }
    }
  },
  "Lumbini Province": {
    districts: {
      "Nawalparasi West": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Sunwal","Palhinandan","Ramgram","Pratappur","Susta"] },
      "Rupandehi": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11","Ward 12","Ward 13","Ward 14","Ward 15","Ward 16","Ward 17","Ward 18","Ward 19","Ward 20"], toles: ["Butwal","Siddharthanagar","Lumbini Sanskritic","Devdaha","Marchawari","Rohini","Omsatiya","Siyari"] },
      "Kapilvastu": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Taulihawa","Kapilvastu","Buddhabhumi","Maharajgunj","Shivaraj"] },
      "Arghakhanchi": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Sandhikharka","Sitganga","Subarnagiri","Panini"] },
      "Gulmi": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Tamghas","Musikot","Resunga","Satyawati","Gulmi Darbar"] },
      "Palpa": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11"], toles: ["Tansen","Rampur","Mathagadhi","Ribdikot","Bagnaskali"] },
      "Dang": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11","Ward 12"], toles: ["Ghorahi","Tulsipur","Rajpur","Bangalachuli","Babai","Dangisharan","Lamahi"] },
      "Pyuthan": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Pyuthan Bazar","Sworgadwari","Jhimruk","Gaumul"] },
      "Rolpa": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Liwang","Runtigadhi","Sunchhahari","Lungri"] },
      "Eastern Rukum": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8"], toles: ["Putha Uttarganga","Sisne","Bunai"] }
    }
  },
  "Karnali Province": {
    districts: {
      "Dolpa": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8"], toles: ["Dunai","Thuli Bheri","Dolpo Buddha","Jagdulla"] },
      "Mugu": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7"], toles: ["Gamgadhi","Chhayanath Rara","Khatyad","Mugum Karmarong"] },
      "Humla": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7"], toles: ["Simikot","Namkha","Sarkegad","Chankheli","Adanchuli"] },
      "Jumla": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Khalanga","Kanakasundari","Tatopani","Tila","Sinja"] },
      "Kalikot": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Manma","Khandachakra","Pachaljharana","Subhi Kalika"] },
      "Dailekh": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Narayan","Dullu","Bhagawatimai","Chamunda Bindrasaini","Gurans"] },
      "Jajarkot": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Khalanga Jajarkot","Nalgad","Barekot","Kushe"] },
      "Western Rukum": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Musikot","Aathbiskot","Banfikot","Triveni"] },
      "Salyan": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Shaarda","Bangad Kupinde","Bagchaur","Kapurkot","Kumakhmalika"] },
      "Surkhet": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11","Ward 12","Ward 13","Ward 14","Ward 15","Ward 16","Ward 17","Ward 18","Ward 19"], toles: ["Birendranagar","Bheriganga","Lekbeshi","Gurbhakot","Chaukune","Panchpuri","Barahtal"] }
    }
  },
  "Sudurpashchim Province": {
    districts: {
      "Bajura": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Martadi","Budhiganga","Badimalika","Himali","Tribeni"] },
      "Bajhang": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Chainpur","Jayaprithvi","Thalara","Masta","Bungal"] },
      "Achham": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Mangalsen","Kamalbazar","Chaurpati","Sanphebagar","Mellekh"] },
      "Doti": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Dipayal Silgadhi","Bogtan Fudsil","Jorayal","K I Singh","Purbichauki"] },
      "Kailali": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11","Ward 12","Ward 13","Ward 14","Ward 15","Ward 16","Ward 17","Ward 18","Ward 19","Ward 20","Ward 21","Ward 22","Ward 23","Ward 24"], toles: ["Dhangadhi","Tikapur","Godavari","Lamki Chuha","Ghodaghodi","Bhajani","Joshipur","Gauriganga"] },
      "Kanchanpur": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10","Ward 11","Ward 12","Ward 13","Ward 14","Ward 15","Ward 16","Ward 17","Ward 18","Ward 19","Ward 20"], toles: ["Mahendranagar","Belauri","Shuklaphanta","Krishnapur","Bhimdatta","Punarbas","Bedkot"] },
      "Dadeldhura": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Amargadhi","Ganayapdhura","Aalital","Parashuram"] },
      "Baitadi": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9","Ward 10"], toles: ["Dasharathchand","Dogdakedar","Melauli","Sigas","Surnaya","Purchaudi"] },
      "Darchula": { wards: ["Ward 1","Ward 2","Ward 3","Ward 4","Ward 5","Ward 6","Ward 7","Ward 8","Ward 9"], toles: ["Khalanga Darchula","Duhun","Lekam","Byash","Marma","Naugad"] }
    }
  }
};
