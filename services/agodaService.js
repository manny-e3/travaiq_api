import axios from 'axios';
import https from 'https';
import logger from '../utils/logger.js';

const SUGGESTION_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36',
    'Cookie': 'goda.user.03=UserId=e090ca37-ff2b-4210-b93d-0835d2d4ea22; agoda.version.03=CookieId=52a68687-6f67-423d-803d-d48e6a73fe4e&DLang=en-us&CurLabel=USD; agoda.familyMode=Mode=0; agoda.price.01=PriceView=1; agoda.prius=PriusID=0&PointsMaxTraffic=Agoda; FPID=FPID2.2.0s6gfN6n1Ki9VZPxiwcBxffcoF0QyGz%2BpGhu0%2FD8KTc%3D.1781960194; _fbp=fb.1.1781960204641.380271815655828618; agoda.search.01=SHist=4$40116069$9363$3$1$2$1$0$1781960161$17$0|4$832127$9339$6$1$2$1$0$1782509932$17$0&H=9308|7$40116069|0$832127; t_pp=xNeUNNGBgo/arLgD:VkxUEHy0HqpmjSb/Is/6Bw==:F1o8FMsWmRZ3x5FArhYtak+tGYrBHfqCZtuujW1Q4exjn29vaafo0MlgW1uXeFrNEvO4+G8DIDDRXSv2QFd87ZCbG1qyvLy6Jok0j1jqnIo8aJYSKwzRRuq1MNA/1qGK+DuK4XK5lkFcAD5zdjzhjc3uOfZFYE7DAUeCbrgX48Oea+ZQi+jheUJskHw950WWWb+/BeMmsbKWeu+7mNXtMJVZjEIdoldRaORrs5cHmqNV2XDTvCgiYcNgx6nH; tealiumEnable=true; utag_main=v_id:019ee51a4a39000089d1dc263d850506f00bb06700944$_sn:3$_se:1$_ss:1$_st:1784841292107$ses_id:1784839492107%3Bexp-session$_pn:1%3Bexp-session; agoda.consent=NG||2026-07-23 20:44:53Z; _ga_T408Z268D2=GS2.1.s1784839493$o4$g1$t1784839493$j60$l0$h1558746856; __gads=ID=4eaa6b59b1be2498:T=1784839494:RT=1784839494:S=ALNI_MagBE5iFvdJDmc-m6hqkMyoWWmdLQ; __gpi=UID=000013ef00051c72:T=1784839494:RT=1784839494:S=ALNI_MYIQqOL1ooV59ilqGs7t93K4f3qQA; FPLC=%2FUfQ%2FKPGU5ud3pgjU9S8ajS2B2mf55OnUv54osPh4xV0T%2FTU0co%2BNeLT21RqiYvquYNO2qHpW6kDp6%2Fgychs4VKEu1VhywYeIOuoXaA6cpf%2FaWbB2s5Bowg9L1kJcw%3D%3D; _uetsid=5c21a71086d711f18ee1791b041a0d06|1w0xmxw|2|g7z|0|2395; cto_bundle=olTsf19SUnJGeHV5dmJYSnVwVG5udkQySDFkWHE5OE8zTWhTYkclMkZUbU9UYkVlbzQlMkJVeERUVW40MXlIR0d4YlBxM1hZbWwxdFRXUk5RJTJCVFZHOFZrcVVzbWozQzZlNnJSM1NaU0xBbVJLb2xlRzJWaUdlZ1ZSZXhEaiUyRlNXZVN4Y3F3c1hoRmZ6OUZSOEl4TkR6S1FOYWdvRkEzdyUzRCUzRA; _gid=GA1.2.520274718.1784839496; _uetvid=42e300a0d7a211f0927499588b10ffeb|eoz2nk|1784839496609|1|1|bat.bing.com/p/conversions/c/r; _gcl_au=1.2.1458416403.1781960194; _ga_C07L4VP9DZ=GS2.2.s1784839496$o3$g0$t1784839496$j60$l0$h0; agoda_ptnr_tracking=effb9280-eb56-4858-9441-4380848a860f; __RequestVerificationToken=x6kvJsA0iVnPi96m-Mvz1jQr-nmJQWAWBgBNRoWRSzjANvoNYSyrTDLgC3dvi1-MZoLh3Se2pmFW0tOpf2BVI2C4CJI1; ai_user=G8BM2+drBAvZe27qeKzcej|2026-07-23T20:45:35.072Z; ul.session=0be6c79b-2c65-4993-be9f-8a18723dbfb4; agoda.cid=1739459; agoda.landings=1739459|||ledaudjfdkynv1l3yevurvn4|2026-07-24T03:45:36|True|19----1739459|||ledaudjfdkynv1l3yevurvn4|2026-07-24T03:45:36|True|20----1739459|||ledaudjfdkynv1l3yevurvn4|2026-07-24T03:45:36|True|99; agoda.attr.03=ATItems=1942345$06-27-2026 04:38$|1844104$07-24-2026 03:44$|1739459$07-24-2026 03:45$; ASP.NET_SessionId=ledaudjfdkynv1l3yevurvn4; agoda.attr.fe=1739459|||ledaudjfdkynv1l3yevurvn4|2026-07-24T03:45:36|True|2026-07-25T03:45:36|WHkMLAmzt0Ueyjtn; xsrf_token=CfDJ8Dkuqwv-0VhLoFfD8dw7lYwd0CtSAUdqaklo3oXA7Tyb_ooRDHyA1r6J0DnmgM2Hj8llBi6l8fOC0DrQ29zoVYACJ60pndaBJVrdDH2O1-rK6jZMLOtqt3z9BZ8wX9_nqzs3ZZPPrUC7p9qi--RBuBg; ul.pc.token=eyJhbGciOiJFUzI1NiJ9.eyJtIjo0MjYzMDk5MjMsInIiOlsiMTI3XzM0ODM4NSJdLCJlIjoiKExmPVlNSCNtcGhWblUkVnJVPFFwJkVZPDNbcXVDTihPJVdnNj5dI3EvckBzSWElTE4zJkFQYWRVRSZKWV5lJjE1L0Nqa2k7XSdfTj9Zb0giLCJzcmMiOiJzcmMiLCJzdWIiOiJRaHJZakduZFJpR2lOVnFlbWFOVEl3IiwianRpIjoiTG40QXRfTkhUSDJDaEhUOUJpUHdhUSIsImlhdCI6MTc4NDgzOTYxMSwiZXhwIjoxNzkyNjE1NjExLCJ3bHQiOiJmMWE1OTA1Zi05NjIwLTQ1ZTUtOWQ5MS1kMjUxYzA3ZTBiNDIiLCJzIjoyLCJtYWF0IjoxNzg0ODM5NjExLCJtZmEiOnsiLTEiOjE3ODQ4Mzk2MTF9LCJhYXQiOiJwYXJ0bmVyY2VudGVyIiwibGF0IjoicGFydG5lcmNlbnRlciJ9.M4ejmOuV4ztx1QvlSFPmNCduVkteJWELhU2zV-RqVkItxx9RdD2xb2YU2b2bmM4UJxBcEIJVOEnBMvShESl3hA; ai_session=75MZs0FJ9NXr5xTQs/vESX|1784839535586|1784839611366; _gat_gtag_UA_6446424_35=1; _ga_PJFPLJP2TM=GS2.1.s1784839534$o1$g1$t1784839638$j52$l0$h0; _ga=GA1.2.560262739.1781960194; agoda.analytics=Id=7457434201657288965&Signature=-7566894685629505941&Expiry=1784843264805; t_rc=dD00MCY4RVREKzFtNlhBM05RWW03RFZRdnBRPTImdWlkPWUwOTBjYTM3LWZmMmItNDIxMC1iOTNkLTA4MzVkMmQ0ZWEyMg==.bPgoWPlQAJdquNRxD8hD0R8O8rvfZvRqblqVE9Gjonk=',
    'Accept': 'application/json',
};



const httpsAgent = new https.Agent({ rejectUnauthorized: false });

/**
 * Fetch suggestions from Agoda's HotelSuggest endpoint.
 */
export async function getSuggestions(term) {
    try {
        const response = await axios.get('https://partners.agoda.com/HotelSuggest/GetSuggestions', {
            params: { type: 1, limit: 10, term: term },
            headers: SUGGESTION_HEADERS,
            timeout: 10_000,
            httpsAgent,
        });

        if (response.status !== 200) {
            throw new Error(`Agoda API Error: ${response.status}`);
        }

        return response.data;
    } catch (error) {
        logger.error(`[agodaService] fetchSuggestions error: ${error.message}`);
        throw error;
    }
}

/**
 * Fetch hotels from Agoda's affiliate API.
 */
export async function getHotels(criteria) {
    const partnerId = process.env.AGODA_PARTNER_ID;
    const apiKey = process.env.AGODA_API_KEY;

    try {
        logger.info(`[agodaService] fetchHotels for cityId: ${criteria.cityId}, dates: ${criteria.checkInDate} to ${criteria.checkOutDate}`);
        logger.debug(`[agodaService] Using PartnerID: ${partnerId}, APIKey: ${apiKey ? (apiKey.substring(0, 5) + '...') : 'MISSING'}`);

        const response = await axios.post(
            'http://affiliateapi7643.agoda.com/affiliateservice/lt_v1',
            { criteria },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip,deflate',
                    ...(partnerId && apiKey ? { Authorization: `${partnerId}:${apiKey}` } : {}),
                },
                timeout: 30_000,
            }
        );

        if (response.data?.status === 'Error') {
            logger.error(`[agodaService] Agoda API Error: ${response.data?.message}`);
            return [];
        }

        const results = response.data?.results || [];
        logger.info(`[agodaService] fetchHotels returned ${results.length} results`);
        return results;
    } catch (error) {
        logger.error(`[agodaService] fetchHotels error: ${error.message}`);
        if (error.response) {
            logger.error(`[agodaService] Response data: ${JSON.stringify(error.response.data)}`);
        }
        throw error;
    }
}
