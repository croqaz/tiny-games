window.addEventListener('load', function() {
    const c = document.getElementById('clock');
    const ctx = c.getContext('2d');
    ctx.font = '30px monospace';
    ctx.lineCap = 'round';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const CX = c.width / 2 - 1;
    const CY = c.height / 2 - 1;
    const OUTER = c.width / 2 - 25;
    const LONG = OUTER - 20;

    function toRadians(angle) {
        return angle * (Math.PI / 180);
    }
    function round(num) {
        return ((num * 10) << 0) * 0.1;
    }

    function drawMonths(dt) {
        ctx.lineWidth = 9;
        const len = 10;
        const mo = dt.getMonth() + 1;
        const day = dt.getDate() - 1;
        const moAngle = Math.PI - toRadians(mo * 30 + day);
        // draw month hand
        ctx.beginPath();
        ctx.moveTo(CX + Math.sin(moAngle) * OUTER, CY + Math.cos(moAngle) * OUTER);
        ctx.lineTo(CX + Math.sin(moAngle) * (OUTER+len), CY + Math.cos(moAngle) * (OUTER+len));
        ctx.stroke();
    }
    function drawHours(dt) {
        ctx.lineWidth = 9;
        // middle dot
        ctx.beginPath();
        ctx.arc(CX, CY, 4, 0, 2 * Math.PI);
        ctx.stroke();
        const len = OUTER / 2;
        let hr = dt.getHours();
        // calc hour from 0 to 60
        hr = (hr < 12 ? hr : hr - 12) * 5;
        // add minute from 0 to 5
        hr = hr + round(dt.getMinutes() / 12);
        const hrAngle = Math.PI - toRadians(hr * 6);
        // draw hour hand
        ctx.beginPath();
        ctx.moveTo(CX - Math.sin(hrAngle) * 10, CY - Math.cos(hrAngle) * 10);
        ctx.lineTo(CX + Math.sin(hrAngle) * len, CY + Math.cos(hrAngle) * len);
        ctx.stroke();
    }
    function drawMinutes(dt) {
        // draw minutes hand
        ctx.lineWidth = 6;
        const len = LONG - 40;
        const minAngle = Math.PI - toRadians(dt.getMinutes() * 6);
        ctx.beginPath();
        ctx.moveTo(CX - Math.sin(minAngle) * 20, CY - Math.cos(minAngle) * 20);
        ctx.lineTo(CX + Math.sin(minAngle) * len, CY + Math.cos(minAngle) * len);
        ctx.stroke();
    }
    function drawSeconds(dt) {
        // draw seconds hand
        ctx.lineWidth = 3;
        const secAngle = Math.PI - toRadians(dt.getSeconds() * 6);
        ctx.beginPath();
        ctx.lineTo(CX - Math.sin(secAngle) * 30, CY - Math.cos(secAngle) * 30);
        ctx.lineTo(CX + Math.sin(secAngle) * LONG, CY + Math.cos(secAngle) * LONG);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(CX - Math.sin(secAngle) * 30, CY - Math.cos(secAngle) * 30, 2, 0, 2 * Math.PI);
        ctx.stroke();
    }

    function tick() {
        ctx.clearRect(10, 10, c.width - 10, c.height - 10);
        ctx.strokeStyle = '#191f45';
        ctx.fillStyle = '#94c7eb';

        // outer circle
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(CX, CY, OUTER, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        // months circle
        ctx.beginPath();
        ctx.arc(CX, CY, OUTER+10, 0, 2 * Math.PI);
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
        for (let i = 0; i < 60; i++) {
            const p = toRadians(i*6);
            ctx.beginPath();
            ctx.moveTo(CX + Math.sin(p) * (OUTER - 3), CY + Math.cos(p) * (OUTER - 3));
            ctx.lineTo(CX + Math.sin(p) * (OUTER + 2), CY + Math.cos(p) * (OUTER + 2));
            ctx.stroke();
        }

        ctx.translate(CX, CY);
        for (let num = 1; num < 13; num++){
            ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -OUTER * 0.9);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, OUTER * 0.9);
            ctx.rotate(-ang);
        }

        ctx.translate(-CX, -CY);
        ctx.strokeStyle = '#191f4590';

        // set date for debug: new Date(2022,1,2,12,12,15);
        const dt = window.DT ? window.DT : new Date();
        // draw hands in the right order
        drawMonths(dt);
        drawHours(dt);
        drawMinutes(dt);
        drawSeconds(dt);
    }
    tick();
    setInterval(tick, 1000);
})
