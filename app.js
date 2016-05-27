"use strict";

/**
 * These things bring the pain.
 */
class Weapon {

  constructor(name, damage) {
    this.name = name;
    this.damage = damage;
  }
}

/**
 * Base class for all other Character classes.
 */
class Hero {

  constructor() {
    this.baseDamage = 1.0;
    this.baseHealth = 10.0;
    this.currentHealth = this.baseHealth;
    this.weapon = null;
  }

  alive() {
    return this.currentHealth > 0;
  }

  dead() {
    return !this.alive();
  }
}

/**
 * Melee fighter class.
 */
class Warrior extends Hero {

  constructor(name) {
    super();
    this.name = name;
    this.weapon = new Weapon('Axe', 2.0);
  }

  attack(target) {
    let damage = this.weapon ? this.weapon.damage : this.baseDamage;
    // todo(dmauldin): damageVariance should be part of Weapon
    damage += this.damageVariance(damage);
    damage = damage.toFixed(1);
    target.receiveDamage(damage);
    console.log(this.name + ' does ' + damage + ' damage to ' + target.name + '[' + target.currentHealth + ']');
  }

  receiveDamage(damage) {
    this.currentHealth -= damage;
    if (this.currentHealth < 0) { this.currentHealth = 0; }
  }

  damageVariance(damage) {
    let range = damage * 0.5;
    return (Math.random() * range) - (range / 2);
  }
}

let a = new Warrior('Bertrand');
let b = new Warrior('Diego');

while (b.currentHealth > 0 && a.currentHealth > 0) {
  a.attack(b);
  b.attack(a);
}

if (a.dead() && b.dead()) {
  console.log("Both die!");
} else if (a.alive()) {
  console.log(a.name + " lives!");
} else {
  console.log(b.name + " lives!");
}
