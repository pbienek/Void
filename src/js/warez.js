
/*
 Types: Products, ship upgrades, services


 Products:

 Ship Upgrades: Engines, Fuel Capacity, Cargo Capacity, Shield Upgrades, Radar, Weapons

 Services: Refuel, Repair, Remove bounty


 Ideas...
 Tweak Zombie game to use some of these mechanics, call it RumRampage,  and change art to ships
*/


//Taken from http://www.eliteppc.com/manual/manual.htm#tag36
function warezListGenerator() {
    return [
        {
            name        : 'Food',
            price       : getRandomNum(40, 60),
            description : 'Simple organic products',
            volume      : 1
        },
        {
            name        : 'Textiles',
            price       : getRandomNum(60, 80),
            description : 'Unprocessed fabrics',
            volume      : 1
        },
        {
            name        : 'Radioactives',
            price       : getRandomNum(200, 280),
            description : 'Ores and by-products',
            volume      : 1
        },
        {
            name        : 'Slaves',
            price       : getRandomNum(80, 110),
            description : 'Usually humanoid',
            volume      : 1
        },
        {
            name        : 'Liquor/Wines',
            price       : getRandomNum(250, 320),
            description : 'Exotic spirits from unearthy flora',
            volume      : 1
        },
        {
            name        : 'Luxuries',
            price       : getRandomNum(800, 1100),
            description : 'Perfumes, Spices, Coffee',
            volume      : 1
        },
        {
            name        : 'Narcotics',
            price       : getRandomNum(1100, 1400),
            description : 'Tobacco, Arcturan Megaweed',
            volume      : 1
        }
    ];
}
