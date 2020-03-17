
import isTypedArray from 'lodash/isTypedArray';
import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';
import take from 'lodash/take';
import { food101Classes } from './food101';

export function food101topK(classProbabilities, k = 5) {
  const probs = isTypedArray(classProbabilities)
    ? Array.prototype.slice.call(classProbabilities)
    : classProbabilities;

  const sorted = reverse(
    sortBy(
      probs.map((prob, index) => [ prob, index ]),
      probIndex => probIndex[0]
    )
  );

  const topK = take(sorted, k).map(probIndex => {
    const iClass = food101Classes[probIndex[1]];
    return {
      id: probIndex[1],
      name: iClass.replace(/_/, ' '),
      probability: probIndex[0]
    };
  });
  return topK;
};

export function con(val){
	const values = {baby_back_ribs : 296 , 
baklava : 248 , 
beef_carpaccio : 230 , 
beef_tartare : 240 , 
beet_salad : 470 , 
beignets : 82.5 , 
bibimbap : 527 , 
bread_pudding : 320 , 
breakfast_burrito : 306 , 
bruschetta : 305 , 
caesar_salad : 52 , 
cannoli : 44 , 
caprese_salad : 240 , 
carrot_cake : 250 , 
ceviche : 415 , 
cheesecake : 173 , 
cheese_plate : 321 , 
chicken_curry : 615 , 
chicken_quesadilla : 110 , 
chicken_wings : 293 , 
chocolate_cake : 81 , 
chocolate_mousse : 371 , 
churros : 225 , 
clam_chowder : 170 , 
club_sandwich : 56 , 
crab_cakes : 220 , 
creme_brulee : 266 , 
croque_madame : 150 , 
cup_cakes : 56 , 
deviled_eggs : 305 , 
donuts : 200 , 
dumplings : 452 , 
edamame : 41 , 
eggs_benedict : 122 , 
escargots : 553 , 
falafel : 90 , 
filet_mignon : 333 , 
fish_and_chips : 267 , 
foie_gras : 842 , 
french_fries : 462 , 
french_onion_soup : 312 , 
french_toast : 23 , 
fried_calamari : 229 , 
fried_rice : 172 , 
frozen_yogurt : 163 , 
garlic_bread : 159 , 
gnocchi : 350 , 
greek_salad : 250 , 
grilled_cheese_sandwich : 110 , 
grilled_salmon : 497 , 
guacamole : 175 , 
gyoza : 155 , 
hamburger : 48 , 
hot_and_sour_soup : 295 , 
hot_dog : 39 , 
huevos_rancheros : 290 , 
hummus : 258 , 
ice_cream : 166 , 
lasagna : 207 , 
lobster_bisque : 135 , 
lobster_roll_sandwich : 50 , 
macaroni_and_cheese : 436 , 
macarons : 500 , 
miso_soup : 85 , 
mussels : 35 , 
nachos : 10 , 
omelette : 230 , 
onion_rings : 188 , 
oysters : 276 , 
pad_thai : 43 , 
paella : 1100 , 
pancakes : 379 , 
panna_cotta : 90 , 
peking_duck : 507 , 
pho : 1284 , 
pizza : 300 , 
pork_chop : 250 , 
poutine : 118 , 
prime_rib : 1422 , 
pulled_pork_sandwich : 300 , 
ramen : 322 , 
ravioli : 400 , 
red_velvet_cake : 355 , 
risotto : 293 , 
samosa : 174 , 
sashimi : 116 , 
scallops : 41 , 
seaweed_salad : 111 , 
shrimp_and_grits : 74 , 
spaghetti_bolognese : 83 , 
spaghetti_carbonara : 260 , 
spring_rolls : 350 , 
steak : 60 , 
strawberry_shortcake : 125 , 
sushi : 164.3 , 
tacos : 223 , 
takoyaki : 70 , 
tiramisu : 79 , 
tuna_tartare : 492 , 
waffles : 125 , 
waffles : 140

}

	return values[val]+" calories";  
	return val;
}

