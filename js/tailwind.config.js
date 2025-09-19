tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#FFF5F2',
                    100: '#FFF1ED',
                    200: '#FFE4DB',
                    300: '#FFD5C8',
                    400: '#FFB7A3',
                    500: '#FF9A7F',
                    600: '#C73E1D',
                    700: '#A73517',
                    800: '#7A2711',
                    900: '#5D1E0D',
                },
                dark: {
                    800: '#1A1A1A',
                    900: '#121212',
                }
            },
            fontFamily: {
                'sans': ['Public Sans', 'sans-serif'],
                'serif': ['Castoro', 'serif'],
                'mono': ['Consolas', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-in': 'slideIn 0.5s ease-in-out',
                'slide-in-right': 'slideInRight 0.5s ease-in-out',
                'slide-in-left': 'slideInLeft 0.5s ease-in-out',
                'bounce-slow': 'bounce 3s infinite',
                'cursor-blink': 'cursorBlink 1s infinite',
                'float-logo': 'floatLogo 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateY(50px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(50px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideInLeft: {
                    '0%': { transform: 'translateX(-50px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                cursorBlink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                },
                floatLogo: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            },
        }
    }
}