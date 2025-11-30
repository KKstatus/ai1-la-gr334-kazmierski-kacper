const msg: string = "Hello!";
alert(msg);

const styles: Record<string, string> = {
    'Wodny': 'style-1.css',
    'Noir': 'style-2.css',
    'Noir2': 'style-3.css'
};

const styleLinkId = 'dynamic-theme-style';

function setStyle(styleFileName: string): void {
    let linkElement = document.getElementById(styleLinkId) as HTMLLinkElement;

    if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.id = styleLinkId;
        linkElement.rel = 'stylesheet';
        document.head.appendChild(linkElement);
    }

    linkElement.href = styleFileName;
}

function renderStyleLinks(): void {

    const menuContainer = document.createElement('div');
    menuContainer.style.position = 'fixed';
    menuContainer.style.top = '5px';
    menuContainer.style.right = '5px';
    menuContainer.style.padding = '5px';
    menuContainer.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    menuContainer.style.zIndex = '1000';
    menuContainer.style.fontFamily = 'sans-serif';

    const title = document.createElement('p');
    title.textContent = "Wybierz styl:";
    title.style.margin = "0 0 5px 0";
    title.style.fontWeight = "bold";
    menuContainer.appendChild(title);

    for (const [styleName, fileName] of Object.entries(styles)) {
        const link = document.createElement('a');
        link.textContent = styleName;
        link.href = "#";
        link.style.display = 'block';
        link.style.marginBottom = '5px';
        link.style.color = '#d10000ff';

        link.addEventListener('click', (event) => {
            event.preventDefault();
            setStyle(fileName);
        });

        menuContainer.appendChild(link);
    }

    document.body.prepend(menuContainer);
}

const defaultStyleKey = Object.keys(styles)[0];
setStyle(styles[defaultStyleKey]); // 

renderStyleLinks();