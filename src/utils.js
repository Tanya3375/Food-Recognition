
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
	const values = {"baby back_ribs" : 296 , 
"baklava" : 248 , 
"beef carpaccio" : 230 , 
"beef tartare" : 240 , 
"beet salad" : 470 , 
"beignets" : 82.5 , 
"bibimbap" : 527 , 
"bread pudding" : 320 , 
"breakfast burrito" : 306 , 
"bruschetta" : 305 , 
"caesar salad" : 52 , 
"cannoli" : 44 , 
"caprese salad" : 240 , 
"carrot cake" : 250 , 
"ceviche" : 415 , 
"cheesecake" : 173 , 
"cheese plate" : 321 , 
"chicken curry" : 615 , 
"chicken quesadilla" : 110 , 
"chicken wings" : 293 , 
"chocolate cake" : 81 , 
"chocolate mousse" : 371 , 
"churros" : 225 , 
"clam chowder" : 170 , 
"club sandwich" : 56 , 
"crab cakes" : 220 , 
"creme brulee" : 266 , 
"croque madame" : 150 , 
"cup cakes" : 56 , 
"deviled eggs" : 305 , 
"donuts" : 200 , 
"dumplings" : 452 , 
"edamame" : 41 , 
"eggs benedict" : 122 , 
"escargots" : 553 , 
"falafel" : 90 , 
"filet mignon" : 333 , 
"fish and_chips" : 267 , 
"foie gras" : 842 , 
"french fries" : 462 , 
"french onion_soup" : 312 , 
"french toast" : 23 , 
"fried calamari" : 229 , 
"fried rice" : 172 , 
"frozen yogurt" : 163 , 
"garlic bread" : 159 , 
"gnocchi" : 350 , 
"greek salad" : 250 , 
"grilled cheese_sandwich" : 110 , 
"grilled salmon" : 497 , 
"guacamole" : 175 , 
"gyoza" : 155 , 
hamburger : 48 , 
"hot and_sour_soup" : 295 , 
"hot dog" : 39 , 
"huevos rancheros" : 290 , 
hummus : 258 , 
"ice cream" : 166 , 
lasagna : 207 , 
"lobster bisque" : 135 , 
"lobster roll_sandwich" : 50 , 
"macaroni and_cheese" : 436 , 
macarons : 500 , 
"miso soup" : 85 , 
mussels : 35 , 
nachos : 10 , 
omelette : 230 , 
"onion rings" : 188 , 
oysters : 276 , 
"pad thai" : 43 , 
paella : 1100 , 
pancakes : 379 , 
"panna cotta" : 90 , 
"peking duck" : 507 , 
pho : 1284 , 
pizza : 300 , 
"pork chop" : 250 , 
poutine : 118 , 
"prime rib" : 1422 , 
"pulled pork_sandwich" : 300 , 
ramen : 322 , 
ravioli : 400 , 
"red velvet_cake" : 355 , 
risotto : 293 , 
samosa : 174 , 
sashimi : 116 , 
scallops : 41 , 
"seaweed salad" : 111 , 
"shrimp and_grits" : 74 , 
"spaghetti bolognese" : 83 , 
"spaghetti carbonara" : 260 , 
"spring rolls" : 350 , 
steak : 60 , 
"strawberry shortcake" : 125 , 
sushi : 164.3 , 
tacos : 223 , 
takoyaki : 70 , 
tiramisu : 79 , 
"tuna tartare" : 492 , 
waffles : 125

}
	var consumed = parseInt(window.localStorage.getItem('consumed')) + values[val];
	localStorage.setItem("consumed",consumed)
	return values[val]+" calories";  
}
