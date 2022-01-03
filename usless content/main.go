package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/bwmarrin/discordgo"
)

type ConfigContent struct {
	JBot_token string `json:"token"`
	King_token string `json:"king_token"`
}

// Variables used for command line parameters
var Token string

func init() {
	data, err := ioutil.ReadFile("./data/config.json")
	if err != nil {
		panic(err)
	}
	var config ConfigContent
	err = json.Unmarshal(data, &config)
	if err != nil {
		panic(err)
	}
	Token = config.King_token
	// flag.StringVar(&Token, "t", "", "Bot Token")
	// flag.Parse()
}

func main() {

	// Create a new Discord session using the provided bot token.
	dg, err := discordgo.New("Bot " + Token)
	if err != nil {
		fmt.Println("error creating Discord session,", err)
		return
	}

	// Register the messageCreate func as a callback for MessageCreate events.
	dg.AddHandler(messageCreate)
	dg.AddHandler(setActivity)
	// In this example, we only care about receiving message events.
	dg.Identify.Intents = discordgo.IntentsGuildMessages

	// Open a websocket connection to Discord and begin listening.
	err = dg.Open()
	if err != nil {
		fmt.Println("error opening connection,", err)
		return
	}

	// Wait here until CTRL-C or other term signal is received.
	fmt.Println("Bot is now running.  Press CTRL-C to exit.")

	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt, os.Kill)
	<-sc
	// Cleanly close down the Discord session.
	dg.Close()
}

func setActivity(s *discordgo.Session, r *discordgo.Ready) {
	err := s.UpdateListeningStatus("Пропишите b!games;")
	if err != nil {
		panic(err)
	}
}

// This function will be called (due to AddHandler above) every time a new
// message is created on any channel that the authenticated bot has access to.
func messageCreate(s *discordgo.Session, m *discordgo.MessageCreate) {

	// Ignore all messages created by the bot itself
	// This isn't required in this specific example but it's a good practice.
	if m.Author.ID == s.State.User.ID {
		return
	}
	var roles_map = map[string]string{"b!minecraft": "858709693088923658", "b!amongus": "858822236109406238", "b!starve": "871495227100266566", "b!dwarf": "871495649064022057", "b!roblox": "871496128288407552", "b!rust": "871495641099038741", "b!terraria": "858714294724329472", "b!csgo": "858715522370633798", "b!wot": "858715937259388968", "b!pubg": "858716603574386698", "b!nintendo": "858717300127301632", "b!gta": "858718793319710720"}
	roles, _ := s.GuildRoles(m.GuildID)
	if strings.Split(m.Content, " ")[0] == "b!mute" {
		permissions, err := s.UserChannelPermissions(m.Author.ID, m.ChannelID)
		if err != nil {
			panic(err)
		}
		fmt.Println(permissions)
		if permissions&discordgo.PermissionManageMessages == discordgo.PermissionManageMessages {
			s.GuildMemberRoleAdd(m.GuildID, m.Author.ID, "807348064742146088")
			if err != nil {
				panic(err)
			}
			s.ChannelMessageSendReply(m.ChannelID, "Мьют прошел успешно, спасибо!", m.Reference())
		} else {
			s.ChannelMessageSendReply(m.ChannelID, "У вас нет прав.", m.Reference())
		}
	} else if m.Content == "b!games" {
		var message_array []string
		for command := range roles_map {
			for index := range roles {
				if roles[index].ID == roles_map[command] {
					message_array = append(message_array, "`"+command+"`: **"+roles[index].Name+"**;")
				}
			}
		}
		message_array = append([]string{"Спасибо что спросили! На данный момент доступны эти роли:"}, message_array...)
		message := strings.Join(message_array, "\n")
		s.ChannelMessageSendReply(m.ChannelID, message, m.Reference())
	} else if m.Content == "b!verify" {
		members_role := m.Member.Roles
		for role_index := range members_role {
			if members_role[role_index] == "870948025286156308" {
				break
			}
		}
		err := s.GuildMemberRoleAdd(m.GuildID, m.Author.ID, "870948025286156308")
		if err != nil {
			s.ChannelMessageSend(m.ChannelID, "Невозможно выдать роль.")
			panic(err)
		}
		s.MessageReactionAdd(m.ChannelID, m.ID, "✅")
		_, err = s.ChannelMessageSend("804772492978946092", "***Добро пожаловать на наш уютный сервер, "+m.Author.Username+"!*** Теперь можешь початиться :wink:")
		if err != nil {
			panic(err)
		}
	} else {
		for command := range roles_map {
			if m.Content == command {
				err := s.GuildMemberRoleAdd(m.GuildID, m.Author.ID, roles_map[command])
				if err != nil {
					panic(err)
				}
				var role_name string
				for index := range roles { //Search for need role and get its name.
					if roles[index].ID == roles_map[command] {
						role_name = roles[index].Name
					}
				}
				if err != nil {
					panic(err)
				}
				s.ChannelMessageSend(m.ChannelID, "Вы получили роль `"+role_name+"`. Теперь вы имеете доступ к **Эксклюзивной игровой категории!**\n*Спасибо за использование нашего сервиса!*")
			}
		}
	}
}
