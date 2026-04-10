import { world, system } from "@minecraft/server";

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        const dim = player.dimension;
        const pos = player.location;

        // 1. FIREFLIES (Spawn at night in warm biomes)
        const time = world.getTimeOfDay();
        if (time > 13000 && time < 23000) { // Nighttime
            const biome = dim.getBiome(pos);
            if (biome.temperature > 0.15) { // Warm biome threshold
                if (Math.random() < 0.1) { // Random spawn chance
                    const spawnPos = { 
                        x: pos.x + (Math.random() * 20 - 10), 
                        y: pos.y + Math.random() * 5, 
                        z: pos.z + (Math.random() * 20 - 10) 
                    };
                    dim.spawnParticle("ee:firefly", spawnPos);
                }
            }
        }

        // 2. RAIN RIPPLES
        if (world.isRaining) {
            const ray = dim.getBlockFromRay(pos, { x: 0, y: -1, z: 0 }, { 
                maxDistance: 10, 
                includeLiquidBlocks: true 
            });
            if (ray?.block?.typeId.includes("water")) {
                dim.spawnParticle("ee:rain_ripple", ray.block.location);
            }
        }
    }
}, 10); // Run every 10 ticks for performance
