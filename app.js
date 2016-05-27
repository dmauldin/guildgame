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
    this.mitigation = 0;
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

  constructor(name, mitigation) {
    super();
    this.name = name;
    this.weapon = new Weapon('Axe', 2.0);
    if (mitigation > 0) {
      this.mitigation = Math.random() * mitigation + (mitigation / 2);
    }
  }

  attack(target) {
    let damage = this.weapon ? this.weapon.damage : this.baseDamage;
    // todo(dmauldin): damageVariance should be part of Weapon
    damage += this.damageVariance(damage);
    damage = damage.toFixed(1);
    let receivedDamage = target.receiveDamage(damage);
    console.log(this.name + ' does ' + damage + '(' + receivedDamage + ')'+ ' damage to ' + target.name + '[' + target.currentHealth + ']');
  }

  receiveDamage(damage) {
    let mitigatedDamage = (damage * this.mitigation).toFixed(1);
    let modifiedDamage = (damage - mitigatedDamage).toFixed(1);
    this.currentHealth -= modifiedDamage;
    this.currentHealth = this.currentHealth.toFixed(1);
    if (this.currentHealth < 0) { this.currentHealth = 0; }
    return mitigatedDamage;
  }

  damageVariance(damage) {
    let range = damage * 0.5;
    return (Math.random() * range) - (range / 2);
  }
}

// testing class usage

let a = new Warrior('AAA', 0.1);
let b = new Warrior('BBB');

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
