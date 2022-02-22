window.addEventListener('load', function() {
    const c = document.getElementById('clock');
    const ctx = c.getContext('2d');
    ctx.font = '30px mono';
    ctx.lineCap = 'round';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const CX = c.width / 2 - 1;
    const CY = c.height / 2 - 1;
    const OUTER = c.width / 2 - 25;
    const INNER = OUTER / 3;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const zodiac = [
        ['♑', 21], // capricorn starts dec
        ['♒', 20], // aquarius starts jan
        ['♓', 19], // pisces starts feb
        ['♈', 21], // aries starts mar
        ['♉', 20], // taurus starts apr
        ['♊', 21], // gemini starts may
        ['♋', 21], // cancer starts june
        ['♌', 21], // leo starts july
        ['♍', 21], // virgo starts aug
        ['♎', 21], // libra starts sept
        ['♏', 21], // scorpio starts oct
        ['♐', 21], // sagittarius
    ];

    function toRadians(angle) {
        return angle * (Math.PI / 180);
    }
    function drawDate(dt) {
        ctx.lineWidth = 9;
        ctx.fillStyle = '#111';
        const mo = dt.getMonth();
        // draw date text
        ctx.fillText(dt.getDate().toString(), CX, CY-30);
        ctx.fillText(monthNames[mo], CX, CY);
        ctx.fillText(dt.getFullYear().toString(), CX, CY+30);
    }
    function drawMonths(dt) {
        ctx.lineWidth = 9;
        ctx.fillStyle = '#111';
        const mo = dt.getMonth() + 1;
        const day = dt.getDate() - 1;
        const moAngle = Math.PI - toRadians(mo * 30 + day);
        // draw month hand
        ctx.beginPath();
        ctx.moveTo(CX + Math.sin(moAngle) * INNER, CY + Math.cos(moAngle) * INNER);
        ctx.lineTo(CX + Math.sin(moAngle) * OUTER, CY + Math.cos(moAngle) * OUTER);
        ctx.stroke();
    }
    function drawZodiac() {
      ctx.translate(CX, CY);
      // zodiac names
      for (let num = 0; num < zodiac.length; num++) {
          ang = ((num + zodiac[num][1] / 30) * Math.PI) / 6;
          ctx.rotate(ang);
          ctx.translate(0, -OUTER * 0.9);
          ctx.rotate(-ang);
          ctx.fillText(zodiac[num][0], 0, 0);
          ctx.rotate(ang);
          ctx.translate(0, OUTER * 0.9);
          ctx.rotate(-ang);
      }
      ctx.translate(-CX, -CY);
    }
    function calcMoons(dt) {
        const moons = [];
        let cDT = new Date(dt.getFullYear(), 0, 1);
        for (let i = 0; i < 365; i++) {
            const { phase } = SunCalc.getMoonIllumination(cDT);
            if (phase >= 0.48 && phase <= 0.525) {
                if (cDT.getMonth() !== (moons.length ? moons[moons.length - 1].dt.getMonth() : -1)) {
                    moons.push({ phase, dt: new Date(cDT) });
                }
            }
            if (moons.length === 12) {
                break;
            }
            cDT.setDate(cDT.getDate() + 1);
        }
        return moons;
    }
    function drawMoons(dt) {
        ctx.lineWidth = 1;
        ctx.fillStyle = '#ffd70099';
        const len = OUTER - INNER - 20;
        for (let m of calcMoons(dt)) {
            const mo = m.dt.getMonth() + 1;
            const day = m.dt.getDate() - 1;
            const moAngle = Math.PI - toRadians(mo * 30 + day);
            // draw moon hand
            ctx.beginPath();
            ctx.moveTo(CX + Math.sin(moAngle) * INNER, CY + Math.cos(moAngle) * INNER);
            ctx.lineTo(CX + Math.sin(moAngle) * len, CY + Math.cos(moAngle) * len);
            ctx.stroke();
            // moon circle
            ctx.beginPath();
            ctx.arc(CX + Math.sin(moAngle) * (len+10), CY + Math.cos(moAngle) * (len+10), 10, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        }
    }

    ctx.clearRect(10, 10, c.width - 10, c.height - 10);
    ctx.strokeStyle = '#191f45';
    ctx.fillStyle = '#94c7eb';
    ctx.lineWidth = 3;

    // inner circle
    ctx.beginPath();
    ctx.arc(CX, CY, INNER, 0, 2 * Math.PI);
    ctx.stroke();

    // months circle
    ctx.beginPath();
    ctx.arc(CX, CY, OUTER, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = '#111';
    // 12 thick outer markers
    for (let i = 0; i < 12; i++) {
        const p = toRadians(i*30);
        ctx.beginPath();
        ctx.moveTo(CX + Math.sin(p) * (OUTER - 6), CY + Math.cos(p) * (OUTER - 6));
        ctx.lineTo(CX + Math.sin(p) * (OUTER + 3), CY + Math.cos(p) * (OUTER + 3));
        ctx.stroke();
    }
    // 60 small markers
    ctx.lineWidth = 2;
    for (let i = 0; i <= 48; i++) {
        const p = toRadians(i*7.5);
        ctx.beginPath();
        ctx.moveTo(CX + Math.sin(p) * (OUTER - 3), CY + Math.cos(p) * (OUTER - 3));
        ctx.lineTo(CX + Math.sin(p) * (OUTER + 2), CY + Math.cos(p) * (OUTER + 2));
        ctx.stroke();
    }

    ctx.translate(CX, CY);
    // month names
    for (let num = 0; num < 12; num++){
        ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -OUTER * 0.9);
        ctx.rotate(-ang);
        ctx.fillText(monthNames[num].charAt(0), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, OUTER * 0.9);
        ctx.rotate(-ang);
    }
    ctx.translate(-CX, -CY);
    drawZodiac();

    ctx.strokeStyle = '#191f4590';
    // set date for debug: new Date(2022,1,2,12,12,15);
    const dt = window.DT ? window.DT : new Date();
    drawDate(dt);
    drawMoons(dt);
    drawMonths(dt);
})
