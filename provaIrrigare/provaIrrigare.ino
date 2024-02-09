int IN1 = 2;
int IN2 = 3;
int IN3 = 4;
int IN4 = 5;

int Pin1 = A0; 
int Pin2 = A1;
int Pin3 = A2;
int Pin4 = A3;

float value1 = 0;
float value2 = 0;
float value3 = 0;
float value4 = 0;
void setup() {
  Serial.begin(9600);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  
  pinMode(Pin1, INPUT);
  pinMode(Pin2, INPUT);
  pinMode(Pin3, INPUT);
  pinMode(Pin4, INPUT);
  
   digitalWrite(IN1, HIGH);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, HIGH);
  delay(500);
}

void loop() {
   Serial.print("MOISTURE LEVEL:");
  value1 = analogRead(Pin1);
  Serial.println(value1);
  if(value1>450)
  {
      digitalWrite(IN1, LOW);
      delay(550);
      digitalWrite(IN1, HIGH);
  }
  else
  {
    digitalWrite(IN1, HIGH);
    
  }
   Serial.println();
  delay(1000);
    
    
}
