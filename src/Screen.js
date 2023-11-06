export default class Screen {
    static get device() {
        let device = null;
        const aspectRatio = window.innerWidth / window.innerHeight;
        let forPortrait;
        let forLandscape;
        switch (true) {
            case aspectRatio >= 1.8 || aspectRatio <= 0.55:
                // iPhone 12
                forPortrait = {
                    womanPosition: [0, 10, 0, 10],
                    womanScale: [0.98, 0.98, 0.72, 0.72],
                    scrollY: -170,
                };
                forLandscape = {
                    womanPosition: [-270, 30, 0, 30],
                    womanScale: [0.61, 0.61, 0.97, 0.97],
                    scrollY: -210,
                };
                device = aspectRatio < 1 ? forPortrait : forLandscape;
                break;

            case (aspectRatio >= 1.3 && aspectRatio < 1.6) || (aspectRatio >= 0.63 && aspectRatio < 0.77):
                // iPad
                forPortrait = {
                    womanPosition: [0, 10, 0, 10],
                    womanScale: [0.98, 0.98, 0.53, 0.53],
                    scrollY: -170,
                };
                forLandscape = {
                    womanPosition: [-270, 30, 0, 30],
                    womanScale: [0.6, 0.6, 0.97, 0.97],
                    scrollY: -210,
                };
                device = aspectRatio < 1 ? forPortrait : forLandscape;
                break;

            case (aspectRatio >= 1.6 && aspectRatio < 1.8) || (aspectRatio >= 0.56 && aspectRatio < 0.63):
                // iPhone 8
                forPortrait = {
                    womanPosition: [0, 10, 0, 10],
                    womanScale: [0.98, 0.98, 0.6, 0.6],
                    scrollY: -170,
                };
                forLandscape = {
                    womanPosition: [-270, 30, 0, 30],
                    womanScale: [0.67, 0.67, 0.97, 0.97],
                    scrollY: -210,
                };
                device = aspectRatio < 1 ? forPortrait : forLandscape;
                break;

            default:
                break;
        }

        return device;
    }
}
