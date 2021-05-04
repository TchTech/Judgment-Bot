package main

import (
	"fmt"
	"log"
	"os/exec"
	"time"
)

func warns() {
	fmt.Println("YAAAHHIII")
	time.Sleep(7 * time.Second)
	warns()
}

func main() {
	cmd := exec.Command("node", "bot.js")
	log.Printf("Running command and waiting for it to finish...")
	go warns()
	err := cmd.Run()
	log.Printf("Command finished with error: %v", err)
}
