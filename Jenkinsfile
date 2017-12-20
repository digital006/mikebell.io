#!/usr/bin/env groovy

pipeline {
    agent any

    stages {
        stage('Ruby setup') {
            steps {
                sh 'source \"$HOME/.rvm/scripts/rvm\" && rvm use 2.3.6'
                sh 'source \"$HOME/.rvm/scripts/rvm\" && gem install bundler'
                sh 'source \"$HOME/.rvm/scripts/rvm\" && bundle install'
            }
        }
        stage('Build') {
            steps {
                sh 'source \"$HOME/.rvm/scripts/rvm\" && jekyll build'
                archiveArtifacts artifacts: '**', fingerprint: true
            }
        }
        stage('Deploy') {
            steps {
                sh 'rm -rf /var/www/mikebell.io/*'
                sh 'rsync -avh --exclude=\".git/\" --exclude=\"output_prod\" \"/var/lib/jenkins/jobs/mikebell.io-v2/workspace/_site/\" \"/var/www/mikebell.io/\"'
            }
        }
    }
}
