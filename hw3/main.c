#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
char map[2000][2000];

struct in{
	int len_b;
	int len_e;
	int wid_b;
	int wid_e;
	int score;
};
struct in m[4];

/*void cc(int m,int n){
    int i,j,score=0;
    for(i=0;i<m;i++){
      for(j=0;j<n;j++){
        if(map[i][j]=='*'){
          score++;
        }
      }           
    }
    printf("%d\n",score);
}*/

void *thread(void *ins){
	int i,j;
	struct in *p = (struct in *)ins;
	for(i=p->wid_b;i<p->wid_e;i++){
      for(j=p->len_b;j<p->len_e;j++){
        if(map[i][j]=='*'){
          p->score++;
        }
      }
    }
	pthread_exit(NULL);
}

int main(int argc, char *argv[])
{
    int i=0,j=0,a,b,mid1,mid2;
    char x;
    char map_name[100];
    FILE *f;
    printf("Enter the map name : ");
    gets(map_name); 
    f = fopen(map_name,"r");
    
    while(x=fgetc(f)){
        if(x=='.' || x=='*'){
          map[i][j]=x;
          j++;
        }
        if(x=='#'){
          if(j==0 || map[i][j-1]=='-'){
            map[i][j]='-';
            j++;
            mid2=i+1;
          }else{
            map[i][j]='|';
            j++;
            mid1=j;
          }
        }
        if(x=='\n'){
          a=j;
          i++;
          j=0;
        }
        if(feof(f)){
          b=i;
          break;
        }
    }
    
    m[0].len_b=0;
    m[0].len_e=mid1-1;
    m[0].wid_b=0;
    m[0].wid_e=mid2-1;
    m[0].score=0;
    
    m[1].len_b=mid1;
    m[1].len_e=a;
    m[1].wid_b=0;
    m[1].wid_e=mid2-1;
    m[1].score=0;
    
    m[2].len_b=0;
    m[2].len_e=mid1-1;
    m[2].wid_b=mid2;
    m[2].wid_e=b;
    m[2].score=0;
    
    m[3].len_b=mid1;
    m[3].len_e=a;
    m[3].wid_b=mid2;
    m[3].wid_e=b;
    m[3].score=0;
    
    // print map
    printf(" ");
    for(j=0;j<a;j++)  printf("-");
    printf("\n");
    
    for(i=0;i<b;i++){
      for(j=0;j<a+2;j++){
        if(j==0 || j==a+1){
          printf("|");        
        }else{
          printf("%c",map[i][j-1]);                 
        }
      }
      printf("\n");
    }
    
    printf(" ");
    for(j=0;j<a;j++)  printf("-");
    printf("\n");
    
    //print map size
    printf("map size : %d*%d\n",a,b);

    //thread
	pthread_t m1,m2,m3,m4;
	pthread_create(&m1,NULL,thread,(void *)&m[0]);
	pthread_create(&m2,NULL,thread,(void *)&m[1]);
	pthread_create(&m3,NULL,thread,(void *)&m[2]);
	pthread_create(&m4,NULL,thread,(void *)&m[3]);
	pthread_join(m1,NULL);
	pthread_join(m2,NULL);
	pthread_join(m3,NULL);
	pthread_join(m4,NULL);
    
    int max=0,n;
    for(i=0;i<4;i++){
    	if(m[i].score>=max) {
		max=m[i].score;
		n=i;
		}
	}
	for(i=0;i<4;i++){
		if(m[i].score==max) {
			if(i!=n){
				printf("Miner#%d: %d (draw)\n",i+1,m[i].score);
				n=-1;
			}
			else	printf("Miner#%d: %d (win)\n",i+1,m[i].score);
		}
		else	printf("Miner#%d: %d\n",i+1,m[i].score);
	}
	
  system("PAUSE");	
  return 0;
}
