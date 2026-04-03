import axios from 'axios';
import https from 'https';
import logger from '../utils/logger.js';

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

// Search function - Searches Agoda API for locations
export const search = async (req, res) => {
    const term = req.query.term || req.body.term;

    if (!term || term.trim() === '') {
        return res.json([]);
    }

    // Temporary test data to verify frontend works
    if (term === 'test') {
        return res.json([
            { DisplayText: 'Test Location 1' },
            { DisplayText: 'Test Location 2' },
            { DisplayText: 'Test Location 3' }
        ]);
    }

    try {
        const response = await axios.get('https://partners.agoda.com/HotelSuggest/GetSuggestions', {
            params: {
                type: 1,
                limit: 10,
                term: term
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36',
                'Cookie': 'agoda.user.03=UserId=1c4a4475-5aa5-4398-8128-420fb4ada197; agoda.prius=PriusID=0&PointsMaxTraffic=Agoda; agoda.price.01=PriceView=1; FPID=FPID2.2.Utgqcr%2FZB6QOj%2FFmOTWrRRyiD37vbsYJcsBFQPQa1Eo%3D.1765575231; _fbp=fb.1.1765575243605.82654989758290810; agoda.lastclicks=1922878||9c6545bc-1666-4ddf-9cd0-c70620f2972d||2025-12-29T15:59:07||vlp1f0fh0dvowrgvsdfmzpsc||{"IsPaid":true,"gclid":"Cj0KCQiA6sjKBhCSARIsAJvYcpO8Vu6QYFM-Z0GQXQXgz5xV_q8rfmbpwy4gUgDKcXUVKaacSkwoeXYaAoyiEALw_wcB","Type":""}; _ga_80F3X70H1C=GS2.1.s1766998857$o1$g0$t1766998857$j60$l0$h0; _gcl_aw=GCL.1770651786.Cj0KCQiArt_JBhCTARIsADQZaymoAn8XEBrTKj01tC5TPi-TqhEmLD8Rir7MkP4d-gZDO8vN6nwEaGgaArIQEALw_wcB; _gac_UA-6446424-30=1.1770651788.Cj0KCQiArt_JBhCTARIsADQZaymoAn8XEBrTKj01tC5TPi-TqhEmLD8Rir7MkP4d-gZDO8vN6nwEaGgaArIQEALw_wcB; deviceId=dc954ba7-7246-4dcd-8f72-eccde0e18dfe; agoda.familyMode=Mode=0; _ga_PWCRSK2Y5Y=GS2.1.s1770920236$o1$g0$t1770920237$j59$l0$h694724981; agoda_ptnr_tracking=dd591730-e8ef-4221-ab59-22f2ad312886; ai_user=sVplkHAWTi8KeanjOQy4mg|2026-03-06T06:17:45.270Z; partnerLocale=en-us; agoda.search.01=SHist=4$13827042$9246$5$1$2$1$0$1770713392$17|4$4519329$9246$5$1$2$1$0$1772778025$17|4$18885169$9341$5$1$2$1$0$1774291594$17|1$571$9221$1$1$2$0$0$1774380287$|4$69684815$9221$1$1$2$0$0$$&H=9214|43$13827042|19$4519329|1$18885169|0$69684815$15683738; agoda.version.03=CookieId=e7ee010c-c7a4-4449-a436-6509a77f3027&DLang=en-us&CurLabel=USD; tealiumEnable=true; utag_main=v_id:019b147bb1c900b059ab1d9c96400506f00160670093c$_sn:10$_se:1$_ss:1$_st:1774735329758$ses_id:1774733529758%3Bexp-session$_pn:1%3Bexp-session; agoda.consent=NG||2026-03-28 21:32:10Z; _ga_T408Z268D2=GS2.1.s1774733530$o15$g1$t1774733530$j60$l0$h390637764; FPLC=0U7A6ZB%2Fz%2FXofXqryh9Mvf77AEgYMkACOLdTg8hNosoIqNYFS6%2Bd6g5mFAMwwrST97j9vDAQht2TbeEQArQMYGFdIhhNQNh7yHbUqvko41ckutovWZuMnrH6F4vxeg%3D%3D; __gads=ID=bb9ec13195ef35a8:T=1766998751:RT=1774733533:S=ALNI_MYbseiLyXksyUv6u0_kRZh3v3j2_A; __gpi=UID=000012bca2072489:T=1766998751:RT=1774733533:S=ALNI_MaM9blYv_8JdNibmrrCQ3ml1m1Qzw; _uetsid=943def502aed11f1aa3caffe3e83126b|18eu4s3|2|g4q|0|2278; _uetvid=42e300a0d7a211f0927499588b10ffeb|pybbdr|1774733531473|1|1|bat.bing.com/p/conversions/c/f; _gid=GA1.2.184887786.1774733534; _gcl_au=1.2.1333527261.1774275576; _ga_C07L4VP9DZ=GS2.2.s1774733534$o10$g0$t1774733534$j60$l0$h0; cto_bundle=pT9YKl9SUnJGeHV5dmJYSnVwVG5udkQySDFlU1pEeDJDMnhIQTB4WHFDa0d6c2NPUmtxZnl6cnEzanJsNDZ3QkVSUFd3aFN0ZnIxY3dlQkpDUmFqbkVETHhzU1AlMkY4RGV2dmxNJTJCS2ZPSENoY1c1a0E1dTJ5QUJrUTRva0lyTmtmV0YyMG45Qm5WeWFYciUyQkVhUVloNHpXSCUyRmdIUSUzRCUzRA; __RequestVerificationToken=FwLbHqdKInQt3POqb8TyLOp2XltVNHgG8X5wE9DvkVCXEFzfo2diGxoMYGg2w0kC_ctMVThwL1LEbdX7pR_qwgUm2uw1; t_pp=R17hSqYh2q5HyWup:RoYL9xANwePn4wXwkRhOrg==:UWOH70K2mbaqibSDHT+UC8ugCvK7UfvaFOXJhy5xD7hlIpn29gvRN9QTXCEeIlop8beHL1+oyrFZ0XS98CZ794c8UfO126s+tvIMOupeCiJbr1kDCHAYwf+vC2Y1vg0lVOWnXhm7vxLgxouBV2HAN/e6juyAKQXzBgt4FldlZ2BiZTuDkahgEr1pEqzSX1SQrHSEnQAQD4vjau9+b133yRY/TPHucEH1N0Te5VsXQBk63P0o9PAv; ai_session=cndk+9A1je22+gE2F6f5Dv|1774772919981|1774772919981; ul.session=092aeb3a-606f-4eab-84cc-d875bf396211; agoda.landings=1739459|||mwwcesgp2uwnkmbbgbkbvgd2|2026-03-29T15:28:40|True|19----1739459|||mwwcesgp2uwnkmbbgbkbvgd2|2026-03-29T15:28:40|True|20----1739459|||mwwcesgp2uwnkmbbgbkbvgd2|2026-03-29T15:28:40|True|99; agoda.attr.03=ATItems=-1$12-13-2025 04:32$|1922878$02-09-2026 22:42$9c6545bc-1666-4ddf-9cd0-c70620f2972d|1942345$02-10-2026 15:49$|-1$03-06-2026 13:16$|1739459$03-06-2026 13:17$|-1$03-23-2026 21:19$|1739459$03-23-2026 21:19$|1942345$03-25-2026 02:23$|1844104$03-25-2026 02:25$|-1$03-29-2026 04:32$|1739459$03-29-2026 15:28$; ASP.NET_SessionId=mwwcesgp2uwnkmbbgbkbvgd2; agoda.attr.fe=1739459|||mwwcesgp2uwnkmbbgbkbvgd2|2026-03-29T15:28:40|True|2026-03-30T15:28:40|xiJS23prEMxG3eQz; xsrf_token=CfDJ8Dkuqwv-0VhLoFfD8dw7lYyLcGzXLJbSYisbroekWQHIuGgudQVNFesraIJN-ADdnYXgkEfr6kE1iuYU0yDR4hiCne9fvZlh0qqggVSeXSG8ywYIdAArG46eO1Fxu5BrXIqmkLGot7TswAcn1aVKoGU; ul.pc.token=eyJhbGciOiJFUzI1NiJ9.eyJtIjo0MjYzMDk5MjMsInIiOlsiMTI3XzM0ODM4NSJdLCJlIjoiTWBWVmM0TkBJXFxkTixMbyhNPVhqMDUzI0pxQmI0PzV0cSRWZGEuJlE4LEc1O1h1bWo4bWw4YTs8PGpaRzw7XkZpWlhWaXBLNDVbJ1JXM0dRIiwic3JjIjoic3JjIiwic3ViIjoiUWhyWWpHbmRSaUdpTlZxZW1hTlRJdyIsImp0aSI6IkRWNHNhOHRRUnBpdHBjMTFHMUZBZ0EiLCJpYXQiOjE3NzQ3NzI5MjgsImV4cCI6MTc4MjU0ODkyOCwid2x0IjoiZjFhNTkwNWYtOTYyMC00NWU1LTlkOTEtZDI1MWMwN2UwYjQyIiwicyI6MiwibGF0IjoicGFydG5lcmNlbnRlciJ9.YR-uBBYu6TdffbMxP1YxM7zwEXCobPx5TScRvOfACYfg2CHH2mK2ZLrIEPJmgX1dPsHf0uLe2H49q_hupwwwRw; _ga=GA1.2.137797662.1765575231; _ga_PJFPLJP2TM=GS2.1.s1774772918$o7$g1$t1774772953$j25$l0$h0; agoda.analytics=Id=-7972103523696677307&Signature=2006607592920049195&Expiry=1774776566206; t_rc=dD00MSY4RVREKzFtNlhBM05RWW03RFZRdnBRPTEmdWlkPTFjNGE0NDc1LTVhYTUtNDM5OC04MTI4LTQyMGZiNGFkYTE5Nw==.xE8ypVMZdeA6ScWORaoZxsFSqkWGYNWow5MBWEBwrMk=',
                'Accept': 'application/json',
            },
            timeout: 10000,
            httpsAgent: httpsAgent
        });

        if (response.status === 200) {
            const data = response.data;
            logger.info(`Agoda API Response: ${JSON.stringify(data).substring(0, 500)}...`);
            return res.json(data);
        } else {
            logger.error(`Agoda API Error: ${response.status} - ${JSON.stringify(response.data)}`);
            return res.status(500).json({ error: 'Failed to fetch data' });
        }

    } catch (error) {
        logger.error(`Exception caught: ${error.message}`);
        return res.status(500).json({
            error: 'Unable to contact Agoda API',
            message: error.message
        });
    }
};
