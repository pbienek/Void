$.Upgrades = {

    hull : {
        currentLevel : 0,
        description : 'The fragile material separating you and the void.',
        levels : {
            level1 : {
                total : 500,
                price : 500
            },
            level2 : {
                total : 750,
                price : 1000
            },
            level3 : {
                total : 1000,
                price : 1500
            },
            level4 : {
                total : 1250,
                price : 2000
            },
            level5 : {
                total : 1500,
                price : 2500
            }
        }

    },


    shield : {
        currentLevel : 0,
        description : 'Your first layer of defence.',
        levels : {
            level1 : {
                total : 500,
                price : 500,
                regenerationRate : 0.2
            },
            level2 : {
                total : 750,
                price : 1000,
                regenerationRate : 0.3
            },
            level3 : {
                total : 1000,
                price : 1500,
                regenerationRate : 0.5
            },
            level4 : {
                total : 1250,
                price : 2000,
                regenerationRate : 0.7
            },
            level5 : {
                total : 1500,
                price : 2500,
                regenerationRate : 1
            }
        }
    },


    engine : {
        currentLevel : 0,
        description : 'Increase top speed, ACCELERATION & fuel capacity',
        levels : {
            level1 : {
                topSpeed     : 7,
                acceleration : 0.04,
                price : 500
            },
            level2 : {
                topSpeed     : 8,
                acceleration : 0.05,
                total : 750,
                price : 1000
            },
            level3 : {
                topSpeed     : 9,
                acceleration : 0.06,
                total : 1000,
                price : 1500
            },
            level4 : {
                topSpeed     : 10,
                acceleration : 0.07,
                total : 1250,
                price : 2000
            },
            level5 : {
                topSpeed     : 13,
                acceleration : 0.1,
                total : 1500,
                price : 2500
            }
        }
    },

    laser : {
        currentLevel : 0,
        description : 'Everyone could do with a more powerful laser',
        levels : {
            level1 : {
                coolDown : 4,
                hp       : 25,
                speed    : 9,
                width    : 40,
                height   : 2,
                price : 500
            },
            level2 : {
                coolDown : 3,
                hp       : 35,
                speed    : 10,
                width    : 50,
                height   : 3,
                price : 1000
            },
            level3 : {
                coolDown : 2,
                hp       : 50,
                speed    : 10,
                width    : 80,
                height   : 4,
                price : 1500
            },
            level4 : {
                coolDown : 2,
                hp       : 70,
                speed    : 13,
                width    : 90,
                height   : 5,
                price : 2000
            },
            level5 : {
                coolDown : 1,
                hp       : 90,
                speed    : 15,
                width    : 120,
                height   : 6,
                price : 2500
            }
        }
    },

    radar : {
        currentLevel : 0,
        description : 'The sooner you can spot trouble, the better.',
        levels : {
            level1 : {
                radius : 6000,
                price  : 500
            },
            level2 : {
                radius : 9000,
                price  : 1000
            },
            level3 : {
                radius : 15000,
                price  : 1500
            },
            level4 : {
                radius : 20000,
                price  : 2000
            },
            level5 : {
                radius : 35000,
                price  : 2500
            }
        }
    }

};
