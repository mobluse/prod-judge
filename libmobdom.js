/*
 * DOMLib -- libmobdom.js 0.1
 *
 * Copyright (c) 2008 Mikael Bonnier <http://www.df.lth.se.orbin.se/~mikaelb/>.
 * Licensed under the MIT <http://www.opensource.org/licenses/mit-license.php> license.
 * Validated by <http://www.javascriptlint.com/online_lint.php>.
 */
// Inspired from dom_library.js from www.MAH.se course in web programming.
// dom_library.js ingår i övningsmateriel från kursen Webbprogrammering, DA123A,
// HT08 vid Malmö högskola.
// Filerna hämtades från kursplatsen på It's learning (www.mah.se/lms) 2008-10-08.

function setText(element, string) {
    removeAllChildren(element);
    var textNode = document.createTextNode(string);
    element.appendChild(textNode);
}

function removeAllChildren(element) {
    while (element.firstChild !== null) {
        element.removeChild(element.firstChild);
    }
}
