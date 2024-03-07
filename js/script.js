var gobang = document.getElementById('gobang');
var context = gobang.getContext('2d');
context.strokeStyle = "#202020";
var texture = new Image();
texture.src = "images/texture.png";
texture.onload = function ()
{
    context.drawImage(texture, 0, 0, 900, 900);
    for (var i = 0; i < 15; i++)
    {
        context.moveTo(30 + i * 60, 30);
        context.lineTo(30 + i * 60, 870);
        context.stroke();
        context.moveTo(30, 30 + i * 60);
        context.lineTo(870, 30 + i * 60);
        context.stroke();
    }
    context.fillStyle = "#202020";
    for(var i=0;i<3;i++)
        for(var j=0;j<3;j++)
        {
            context.beginPath();
            context.arc(30 + (3+i*4) * 60, 30 + (3+j*4) * 60, 5, 0, 2 * Math.PI);
            context.closePath();
            context.fill();
        }
}
var over=false;
var me = true;
var board = [];
for (var i = 0; i < 15; i++)
{
    board[i] = [];
    for (var j = 0; j < 15; j++)
        board[i][j] = 0;
}
var win = [];
for (var i = 0; i < 15; i++)
{
    win[i]=[];
    for (var j = 0; j < 15; j++)
        win[i][j]=[];
}
var count=0;
for(var i=0;i<15;i++)
    for(var j=0;j<11;j++)
    {
        for(var k=0;k<5;k++)
            win[i][j+k][count]=true;
        count++;
    }
for(var i=0;i<11;i++)
    for(var j=0;j<15;j++)
    {
        for(var k=0;k<5;k++)
            win[i+k][j][count]=true;
        count++;
    }
for(var i=0;i<11;i++)
    for(var j=0;j<11;j++)
    {
        for(var k=0;k<5;k++)
            win[i+k][j+k][count]=true;
        count++;
    }
for(var i=0;i<11;i++)
    for(var j=14;j>3;j--)
    {
        for(var k=0;k<5;k++)
            win[i+k][j-k][count]=true;
        count++;
    }
var win1=[],win2=[];
for(var i=0;i<count;i++)
{
    win1[i]=0;
    win2[i]=0;
}
var oneStep = function (i, j, me)
{
    context.beginPath();
    context.arc(30 + i * 60, 30 + j * 60, 28, 0, 2 * Math.PI);
    context.closePath();
    gradient = context.createRadialGradient(30 + i * 60 + 4, 30 + j * 60 - 4, 29, 30 + i * 60 + 4, 30 + j * 60 - 4, 0);
    if (me)
    {
        gradient.addColorStop(0, "#0A0A0A");
        gradient.addColorStop(1, "#636766");
    }
    else
    {
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
    }
    context.fillStyle = gradient;
    context.fill();
}
gobang.onclick = function (e)
{
    if(over==true)return;
    if(!me)return;
    var i = Math.floor(e.offsetX / 60);
    var j = Math.floor(e.offsetY / 60);
    if (board[i][j] == 0)
    {
        oneStep(i, j, me);
        board[i][j] = 1;
        for(var k=0;k<count;k++)
            if(win[i][j][k])
            {
                win1[k]++;
                win2[k]=-1;
                if(win1[k]==5)
                {
                    window.alert("你赢了！");
                    over=true;
                }
            }
        if(!over)
        {
            me=!me;
            AI();
        }
    }
}
var AI=function()
{
    var score1=[],score2=[];
    var max=0,m=0,n=0;
    for(var i=0;i<15;i++)
    {
        score1[i]=[];
        score2[i]=[];
        for(var j=0;j<15;j++)
        {
            score1[i][j]=0;
            score2[i][j]=0;
        }
    }
    for(var i=0;i<15;i++)
        for(var j=0;j<15;j++)
            if(board[i][j]==0)
            {
                for(var k=0;k<count;k++)
                    if(win[i][j][k])
                    {
                        if(win1[k]==1)
                            score1[i][j]+=20;
                        else if(win1[k]==2)
                            score1[i][j]+=40;
                        else if(win1[k]==3)
                            score1[i][j]+=200;
                        else if(win1[k]==4)
                            score1[i][j]+=1000;
                        if(win2[k]==1)
                            score2[i][j]+=22;
                        else if(win2[k]==2)
                            score2[i][j]+=42;
                        else if(win2[k]==3)
                            score2[i][j]+=210;
                        else if(win2[k]==4)
                            score2[i][j]+=2000;
                    }
                if(score1[i][j]>max)
                {
                    max=score1[i][j];
                    m=i;
                    n=j;
                }
                else if(score1[i][j]==max&&score2[i][j]>score2[m][n])
                {
                    m=i;
                    n=j;
                }
                if(score2[i][j]>max)
                {
                    max=score2[i][j];
                    m=i;
                    n=j;
                }
                else if(score2[i][j]==max&&score1[i][j]>score1[m][n])
                {
                    m=i;
                    n=j;
                }
            }
    oneStep(m,n,me);
    board[m][n]=2;
    for(var k=0;k<count;k++)
        if(win[m][n][k])
        {
            win2[k]++;
            win1[k]=-1;
            if(win2[k]==5)
            {
                window.alert("你输了！");
                over=true;
            }
        }
    if(!over)
        me=!me;
}