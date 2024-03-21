package main

import (
	"context"
	"fmt"

	"github.com/nicklaw5/helix"
	"github.com/wailsapp/wails/v2/pkg/logger"

	"github.com/jellemeeus/compilations/config"
	"github.com/jellemeeus/compilations/twitch"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// App struct
type App struct {
	ctx                context.Context
	Logger             logger.Logger
	LogLevel           logger.LogLevel
	LogLevelProduction logger.LogLevel
	cfg                config.Config
	db                 *gorm.DB
}

// NewApp creates a new App application struct
func NewApp() (*App, error) {
	cfg, err := config.New()
	if err != nil {
		return nil, err
	}

	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(&helix.Clip{})

	return &App{
		Logger:             logger.NewDefaultLogger(),
		LogLevel:           logger.INFO,
		LogLevelProduction: logger.ERROR,
		cfg:                cfg,
		db:                 db,
	}, nil
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Click returns GetClips response
func (a *App) GetClips() string {
	twitchClient, err := twitch.Initialize(a.cfg.Twitch)
	if err != nil {
		panic(err)
	}

	resp, err := twitchClient.GetClips(&helix.ClipsParams{
		BroadcasterID: "26490481", // summit1g
		First:         100,        // maximum 100
	})
	if err != nil {
		panic(err)
	}

	// Batch Insert with "insert or ignore" modifier to avoid failure on duplicate entries
	result := a.db.Clauses(clause.Insert{Modifier: "or ignore"}).Create(&resp.Data.Clips)
	err = result.Error
	if err != nil {
		panic(err)
	}

	return fmt.Sprintf("GetClips(): %+v Rows Affected\n", result.RowsAffected)
}

// Click returns GetClips response
func (a *App) LoadClipsFromDB() []helix.Clip {
	var clips []helix.Clip
	result := a.db.Limit(4).Find(&clips)
	err := result.Error
	if err != nil {
		panic(err)
	}

	return clips
}
