import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  account: string

  @Column()
  address: string

  @Column()
  signature: string

  constructor (account: string, address: string, signature: string) {
    this.account = account
    this.address = address
    this.signature = signature
  }

  toJSON () {
    return {
      id: this.id,
      account: this.address,
      address: this.address,
      signature: this.signature
    }
  }
}
