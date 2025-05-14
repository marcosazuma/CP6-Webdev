import { Icon } from '@iconify/react/dist/iconify.js';
import { animate } from 'animejs';
import { useRef, useEffect, useState } from 'react';

export default function CardAnim({ id, imgid, onClick }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isFixed, setIsFixed] = useState(false)
    const frontRef = useRef(null);
    const backRef = useRef(null);
    const imgUrl = `https://picsum.photos/id/${imgid}/200/300`

    function open() { 
        animate(backRef.current, {
            scaleX: [1, 0],
            duration: 250,
            easing: 'inQuad',
            onComplete: () => {
                animate(frontRef.current, {
                    scaleX: [0, 1],
                    duration: 250,
                    onComplete: () => {
                        setIsOpen(true)
                    }
                });
            }
        });
    }

    function close() {
        animate(frontRef.current, {
            scaleX: [1, 0],
            duration: 250,
            easing: 'inQuad',
            onComplete: () => {
                animate(backRef.current, {
                    scaleX: [0, 1],
                    duration: 250,
                    easing: 'inQuad',
                    onComplete: () => {
                        setIsOpen(false)
                    }
                });
            }
        });
    }

    function click() {
        console.log("isFixed", isFixed);
        if (!isFixed) {
            onClick({ id, imgid })
            isOpen ? close() : open()
        }
    }

    return (
        <>
            <div className="relative m-1 w-26 h-26 cursor-pointer">
                <div ref={frontRef} onClick={click} className="top-0 scalex0 border rounded bg-gray-300">
                    <img src={imgUrl} className="rounded w-26 h-26" alt="" />
                </div>
                <div ref={backRef} onClick={click} className="absolute flex items-center justify-center top-0 w-full h-full border rounded bg-gray-300">
                    <Icon icon="game-icons:card-random" className="text-3xl text-gray-500" />
                </div>
            </div>
        </>
    )
}