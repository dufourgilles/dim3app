import Axios from 'axios';

export function randomString(length) {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~';
    let result = '';

    while (length > 0) {
        const bytes = new Uint8Array(16);
        window.crypto.getRandomValues(bytes);

        bytes.forEach(function(c) {
            if (length === 0) {
                return;
            }
            if (c < charset.length) {
                result += charset[c];
                length--;
            }
        });
    }
    return result;
}

export function uriEncode(uri) {
    return encodeURIComponent(uri).replace(/'/g,"%27").replace(/"/g,"%22");	
}

export function uriDecode(encoded) {
    return decodeURIComponent(encoded.replace(/\+/g,  " "));
}

export function splitHash(windowHash) {
    // erase the #
    const hash = windowHash.substr(1);
    //split on the &
    return hash.split('&').reduce(function (result, item) {
        const parts = item.split('=');
        result[parts[0]] = parts[1];
        return result;
    }, {});
}

export function getSecuredData(token) {
    return Axios.get(
        `/secure/data&t=${Date.now()}`,
        {
            headers: {
                "Content-type": "application/json",
                "Authorization": `bearer ${token}`
            }
        }
    )
}

export function refreshToken(keycloakBaseURI, refreshToken) {
    console.log("Get user token");
    const params = new URLSearchParams();
    params.append('client_id', 'iot-proxy');
    params.append('client_secret', '18746b56-70e4-41a4-958f-152a2b7a89ae');
    params.append('grant_type', "refresh_token");
    params.append('refresh_token', refreshToken);

    return Axios.post(
        `${keycloakBaseURI}/auth/realms/gdnet-iot/protocol/openid-connect/token`,
        params,
        {
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
            }
        }
    )
}

export function getKeyCloakURL(propsURI) {
    const arr = window.location.href.split("/");
    console.log("connected to ", arr[2]);
    const host = arr[2].split(":");
    const keycloakBaseURI = arr[2].indexOf("dufour") >= 0 ? `https://${host[0]}:8443` : propsURI;
    console.log("createUser", keycloakBaseURI);
    return keycloakBaseURI;
}