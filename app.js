"use strict";

var mainloop = require('mainloop.js');

/**
 * These things bring the pain.
 */
class Weapon {

  /**
   * @param {string} name
   * @param {number} damage
   * @param {number} stamina
   */
  constructor(name, damage, stamina) {
    this.name = name;
    this.damage = damage;
    this.stamina = stamina;
  }
}

/**
 * These things reduce the pain.
 */
class Armor {

  /**
   * @param {string} name
   * @param {number} mitigation
   */
  constructor(name, mitigation) {
    this.name = name;
    this.mitigation = mitigation;
  }
}

/**
 * Base class for all other Character classes.
 */
class Hero {

  constructor() {
    this.baseDamage = 5;
    this.baseHealth = 100;
    this.currentHealth = this.baseHealth;
    this.weapon = null;
    this.mitigation = 0;
  }

  /** @return {boolean} */
  alive() {
    return this.currentHealth > 0;
  }

  /** @return {boolean} */
  dead() {
    return !this.alive();
  }
}

/**
 * Melee fighter class.
 */
class Warrior extends Hero {

  /**
   * @param {string} name
   * @param {number} mitigation
   */
  constructor(name, mitigation) {
    super();
    this.name = name;
    this.weapon = new Weapon('Axe', 10, 2.0);
    if (mitigation > 0) {
      this.mitigation = Math.random() * mitigation + (mitigation / 2);
    }
  }

  /**
   * @param {Hero} target
   */
  attack(target) {
    let damage = this.weapon ? this.weapon.damage : this.baseDamage;
    // todo(dmauldin): damageVariance should be part of Weapon
    damage += this.damageVariance(damage);
    damage = damage.toFixed(1);
    let mitigatedDamage = target.receiveDamage(damage);
    console.log(this.name + ' does ' + damage + ' (' + mitigatedDamage + ' mitigated)'+ ' damage to ' + target.name + ' [new HP: ' + target.currentHealth + ']');
  }

  /**
   * @param {number} damage
   * @return {number} damage modified by hero's mitigation
   */
  receiveDamage(damage) {
    let mitigatedDamage = (damage * this.mitigation).toFixed(1);
    let modifiedDamage = (damage - mitigatedDamage).toFixed(1);
    this.currentHealth -= modifiedDamage;
    this.currentHealth = this.currentHealth.toFixed(1);
    if (this.currentHealth < 0) { this.currentHealth = 0; }
    return mitigatedDamage;
  }

  /**
   * @param {number} damage
   * @return {number} damage modifier (ex: for damage 5, modifier may be -2 to 2)
   */
  damageVariance(damage) {
    let range = damage * 0.5;
    return (Math.random() * range) - (range / 2);
  }
}

function livingPlayers(players) {
  return players.filter(function(player) {
    return player.currentHealth > 0;
  });
}

function numLiving(players) {
  return livingPlayers(players).length;
}

function anyLiving(players) {
  return numLiving(players) > 0;
}

function winMessage(players) {
  if (numLiving(players) === 0) {
    return "Nobody lived!";
  } else if (numLiving(players) === 1) {
    return livingPlayers(players)[0].name + ' wins!';
  }
}

let players = [new Warrior('Conan', 0.1), new Warrior('Einar', 0.1)];

function update(delta) {
  for (var i = 0, l = players.length; i < l; i++) {
    players[i].attack(players[(i+1) % l]);
  }
  if (numLiving(players) <= 1) {
    console.log(winMessage(players));
    mainloop.stop();
  }
}

// testing class usage

mainloop.setUpdate(update).start();
