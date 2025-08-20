export default class Environment {
    public environments = {
        Earth: { g: 9.8, airResistance: 0.47 },
        Mars: { g: 3.7, airResistance: 0.30 },
        Moon: { g: 1.62, airResistance: 0.05 }
    };

    //---------- Cho Trái Đất làm môi trường mặc định ---------//
    public gravity = this.environments.Earth.g;
    public airResistance = this.environments.Earth.airResistance;

    //----------- Đổi môi trường ---------//
    public setEnvironment(EnvName: keyof typeof this.environments): void {
        const env = this.environments[EnvName];
        this.gravity = env.g;
        this.airResistance = env.airResistance;
    }
}
