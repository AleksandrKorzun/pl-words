export default class Screen {
    static get phoneProportions() {
        return window.innerWidth / window.innerHeight >= 1.6 || window.innerHeight / window.innerWidth >= 1.6;
    }
}
