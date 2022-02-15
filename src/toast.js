import gsap from 'gsap';

export default class Toast {
    constructor(type, message) {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.appendChild(document.createElement('p'));
        toast.children[0].innerText = message;
        document.querySelector('#lab-view').appendChild(toast);
        gsap.from(toast, {
            alpha: 0,
            duration: 1,
            y:-20
        })
        setTimeout(() => {
            gsap.to(toast, {
                alpha: 0,
                duration: 1,
                y:-20,
                onComplete: () => {
                    document.querySelector('#lab-view').removeChild(toast)
                }
            })

        }, 2000);
    }
}
