import { AUTO, Display, Game } from "phaser3";
import DebugDrawer from "./debug-drawer.js";
import { b2BodyType } from "@box2d/core";
import { b2CircleShape } from "@box2d/core";
import { b2PolygonShape } from "@box2d/core";
import { b2World } from "@box2d/core";
import { DrawShapes } from "@box2d/core";

const config = {
    type: AUTO,
    parent: "phaser-example",
    width: 300,
    height: 300,
    scene: { create, update }
};

const game = new Game(config);

async function create() {
    this.world = b2World.Create({ x: 0, y: 9.8 });
    this.pixelsPerMeter = 30;

    this.graphics = this.add.graphics();
    this.debugDrawer = new DebugDrawer(this.graphics, this.pixelsPerMeter);

    // Ground
    const groundShape = new b2PolygonShape();
    groundShape.SetAsBox(130 / this.pixelsPerMeter, 20 / this.pixelsPerMeter);
    const groundBody = this.world.CreateBody({
        type: b2BodyType.b2_staticBody,
        position: { x: 150 / this.pixelsPerMeter, y: 270 / this.pixelsPerMeter }
    });
    groundBody.CreateFixture({ shape: groundShape });

    // Box
    const boxShape = new b2PolygonShape();
    boxShape.SetAsBox(30 / this.pixelsPerMeter, 30 / this.pixelsPerMeter);
    const boxBody = this.world.CreateBody({
        type: b2BodyType.b2_dynamicBody,
        position: { x: 100 / this.pixelsPerMeter, y: 30 / this.pixelsPerMeter },
        angle: 30 * Math.PI / 180
    });
    boxBody.CreateFixture({ shape: boxShape, density: 1 });

    // Circle
    const circleShape = new b2CircleShape(20 / this.pixelsPerMeter);
    const circleBody = this.world.CreateBody({
        type: b2BodyType.b2_dynamicBody,
        position: { x: 200 / this.pixelsPerMeter, y: 50 / this.pixelsPerMeter }
    });
    const circleFixture = circleBody.CreateFixture({ shape: circleShape, density: 1 });
    circleFixture.SetRestitution(0.5);

    // Platform
    const platformShape = new b2PolygonShape();
    platformShape.SetAsBox(50 / this.pixelsPerMeter, 5 / this.pixelsPerMeter);
    const platformBody = this.world.CreateBody({
        type: b2BodyType.b2_staticBody,
        position: { x: 220 / this.pixelsPerMeter, y: 200 / this.pixelsPerMeter },
        angle: -20 * Math.PI / 180
    });
    platformBody.CreateFixture({ shape: platformShape });

    this.currentTime = 0;
    this.dt = 0;
    this.lastTime = Date.now();
}

function update() {
    if (!this.world) {
        return;
    }

    this.currentTime = Date.now();
    this.dt = (this.currentTime - this.lastTime) / 1000;
    this.lastTime = this.currentTime;

    this.world.Step(this.dt, { velocityIterations: 3, positionIterations: 2 });
    DrawShapes(this.debugDrawer, this.world);
    this.debugDrawer.clear();
}
