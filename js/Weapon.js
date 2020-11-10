/**
 * Weapon class
 * @class
 * @constructor
 * @param {Number} idWeapon weapon id
 * @param {String} nameWeapon weapon name
 * @param {Number} damagePoint damage point
 * @param {Blob} visual visual
 * @param {String} typeWeapon weapon type
 */
class Weapon {
    constructor(id, nameWeapon, damagePoint, visual, typeWeapon) {
        this.id = id;
        this.nameWeapon = nameWeapon;
        this.damagePoint = damagePoint;
        this.visual = visual;
        this.typeWeapon = typeWeapon;
    }
}

/**
 * weapons array
 * @constant
 * @type {Array}
 */
const weapons = [
 new Weapon(1, "Blue light disc", 10, "./img/disc-1.png", "Default"),
 new Weapon(2, "Yellow light disc",10,"./img/disc-2.png", "Default"),
 new Weapon(3, "Tron-Sword", 20,"./img/weapon-1.jpg", "Custom"),
 new Weapon(4, "Tron-Blaster", 30, "./img/weapon-2.jpg", "Custom"),
 new Weapon(5, "Tron-Mega-Gun", 40,"./img/weapon-3.jpg","Custom"),
 new Weapon(6, "Tron-Shotgun", 50, "./img/weapon-4.jpg", "Custom")
];

/**
 * Default weapons ids array
 * @constant
 * @type {Array}
 */
const defaultWeaponsIds = [1, 2];

/**
 * Weapons to display dynamically on the page html, custom weapons
 * @constant
 * @type {Array}
 */
const weaponsToDisplay = weapons.filter(weapon => !defaultWeaponsIds.includes(weapon.id));

/**
 * Default weapons to hide on page html
 * @constant
 * @type {Array}
 */
const weaponsToHide = weapons.filter(weapon => defaultWeaponsIds.includes(weapon.id));

console.log(weaponsToDisplay);

/**
 * Loop on the weapon table to display dynamically on the html page
 */
for (let weapon in weaponsToDisplay) {
    
    let divRow = document.getElementById('infoWeapon');
    let divCol = document.createElement('div');
    let newH5 = document.createElement('h5');
    let newUl = document.createElement('ul');
    let newLi1 = document.createElement('li');
    let newLi2 = document.createElement('li');
    let newImg = document.createElement('img');

    divRow.appendChild(divCol);
    divRow.appendChild(divCol);
    divCol.setAttribute('id', weaponsToDisplay[weapon].nameWeapon);
    divCol.setAttribute('class', 'col-md-' + (12 / weaponsToDisplay.length));
    divCol.style.border = '5px ridge white';
    divCol.appendChild(newH5);
    newH5.setAttribute('id', 'Title' + weaponsToDisplay[weapon].nameWeapon);
    newH5.style.color = 'orangered';
    newH5.style.paddingTop = '1em';
    newH5.innerHTML = weaponsToDisplay[weapon].nameWeapon;
    divCol.appendChild(newUl);
    newUl.appendChild(newLi1);
    newUl.appendChild(newLi2);
    newLi1.setAttribute('id', weaponsToDisplay[weapon].nameWeapon + 'Visual');
    newLi1.appendChild(newImg);
    newImg.setAttribute('src', weaponsToDisplay[weapon].visual);
    newImg.setAttribute('alt', weaponsToDisplay[weapon].nameWeapon);
    newImg.setAttribute('class', 'img-thumbnail img-fluid')
    newImg.style.width = '100px';
    newImg.style.height= '100px';
    newImg.style.marginTop = '1em';
    newImg.style.marginBottom = '1em';
    newLi2.innerHTML = 'Damage point : ' + weaponsToDisplay[weapon].damagePoint;
    newLi2.setAttribute('id', weaponsToDisplay[weapon].nameWeapon + 'Damage');
    newLi2.style.color = '#04cccc';
}

/**
 * jQuery selector which adds a class to html elements which identify the name of the customized weapons
 */
$('#' + weaponsToDisplay[0].nameWeapon).addClass('animate__animated animate__fadeInLeft animate__slow animate__delay-1s');
$('#' + weaponsToDisplay[1].nameWeapon).addClass('animate__animated animate__fadeInLeft animate__slow animate__delay-0.5s');
$('#' + weaponsToDisplay[2].nameWeapon).addClass('animate__animated animate__fadeInRight animate__slow animate__delay-0.5s');
$('#' + weaponsToDisplay[3].nameWeapon).addClass('animate__animated animate__fadeInRight animate__slow animate__delay-1s');